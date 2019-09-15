import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import {
  generateRegistrationChallenge,
  parseRegisterRequest,
  generateLoginChallenge,
  parseLoginRequest,
  verifyAuthenticatorAssertion,
} from '@webauthn/server';
import * as uuidv4 from 'uuid/v4';
import { UserService } from '../../../user-management/entities/user/user.service';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import {
  AuthData,
  AuthDataType,
} from '../../../user-management/entities/auth-data/auth-data.interface';
import { User } from '../../../user-management/entities/user/user.interface';
import { USER } from '../../../user-management/entities/user/user.schema';
import { TEN_NUMBER, SERVICE } from '../../../constants/app-strings';
import { UserAuthenticatorService } from '../../../user-management/entities/user-authenticator/user-authenticator.service';
import { UserAuthenticator } from '../../../user-management/entities/user-authenticator/user-authenticator.interface';
import { invalidUserException } from '../../../common/filters/exceptions';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { addSessionUser } from '../../guards/auth.guard';
import {
  WebAuthnKeyChallengeRequestedEvent,
  WebauthnChallengeType,
} from '../../events/webauthn-key-registration-requested/webauthn-key-challenge-requested.event';
import { WebAuthnKeyRegisteredEvent } from '../../events/webauthn-key-registered/webauthn-key-registered.event';
import { UserLoggedInWithWebAuthnEvent } from '../../events/user-logged-in-with-webauthn-key/user-logged-in-with-webauthn-key.event';
import { UserAccountModifiedEvent } from '../../../user-management/events/user-account-modified/user-account-modified.event';
import { UserAuthenticatorRemovedEvent } from '../../events/user-authenticator-removed/user-authenticator-removed.event';
import { ConfigService, NODE_ENV } from '../../../config/config.service';

@Injectable()
export class WebAuthnAggregateService extends AggregateRoot {
  constructor(
    private readonly user: UserService,
    private readonly authData: AuthDataService,
    private readonly authenticator: UserAuthenticatorService,
    private readonly settings: ServerSettingsService,
    private readonly config: ConfigService,
  ) {
    super();
  }

  async requestRegister(actorUuid: string, userUuid: string) {
    const settings = await this.settings.findWithoutError();
    const partyName = settings.organizationName || SERVICE;
    const issuerUrl = settings.issuerUrl;
    const relyingParty: { name: string; id?: string } = { name: partyName };
    if (issuerUrl && this.config.get(NODE_ENV) === 'production') {
      try {
        relyingParty.id = new URL(issuerUrl).hostname;
      } catch (error) {}
    }
    await this.validateAuthorizedUser(actorUuid, userUuid);

    if (!userUuid) userUuid = actorUuid;

    const user = await this.user.findOne({ uuid: userUuid });
    if (!user) throw new ForbiddenException();

    const authenticators = await this.authenticator.find({
      userUuid: user.uuid,
    });

    const challengeResponse: any = generateRegistrationChallenge({
      relyingParty,
      user: { id: user.uuid, name: user.email, displayName: user.name },
    });

    challengeResponse.excludeCredentials = authenticators.map(cred => {
      return {
        id: cred.credID,
        type: 'public-key',
      };
    });

    const authData = this.saveChallenge(user, challengeResponse.challenge);
    this.apply(
      new WebAuthnKeyChallengeRequestedEvent(
        authData,
        WebauthnChallengeType.Registration,
      ),
    );

    return challengeResponse;
  }

  async register(body) {
    const { key, challenge } = parseRegisterRequest(body);

    const authData = await this.authData.findOne({
      password: challenge,
      authDataType: AuthDataType.Challenge,
    });

    if (!authData) {
      throw new ForbiddenException();
    }

    const userUuid = authData.entityUuid;

    await this.authData.remove(authData);

    const authenticator = {} as UserAuthenticator;
    authenticator.uuid = uuidv4();
    authenticator.credID = key.credID;
    authenticator.fmt = key.fmt;
    authenticator.publicKey = key.publicKey;
    authenticator.counter = key.counter;
    authenticator.userUuid = userUuid;
    this.apply(new WebAuthnKeyRegisteredEvent(authenticator));

    return { registered: authenticator.uuid };
  }

  async login(username: string) {
    const user = await this.user.findUserByEmailOrPhone(username);
    if (!user) throw invalidUserException;

    const authenticators = await this.authenticator.find({
      userUuid: user.uuid,
    });

    if (authenticators.length === 0) {
      throw new BadRequestException();
    }

    const keys = authenticators.map(cred => ({
      credID: cred.credID,
      fmt: cred.fmt,
      publicKey: cred.publicKey,
    }));

    const assertionChallenge = generateLoginChallenge(keys);

    const authData = this.saveChallenge(user, assertionChallenge.challenge);
    this.apply(
      new WebAuthnKeyChallengeRequestedEvent(
        authData,
        WebauthnChallengeType.Login,
      ),
    );

    return assertionChallenge;
  }

  async loginChallenge(req) {
    const { body, query } = req;
    const { challenge } = parseLoginRequest(body);
    if (!challenge) throw new BadRequestException();

    const authChallenge = await this.authData.findOne({
      authDataType: AuthDataType.Challenge,
      password: challenge,
      entity: USER,
    });
    if (!authChallenge) throw new BadRequestException();

    const user = await this.user.findOne({ uuid: authChallenge.entityUuid });
    if (!user || user.disabled || user.deleted) throw invalidUserException;

    const authenticator = await this.authenticator.findOne({
      userUuid: user.uuid,
      credID: body.rawId,
    });

    if (!authenticator) {
      throw new BadRequestException();
    }

    await this.authData.remove(authChallenge);

    const loggedIn = verifyAuthenticatorAssertion(body, {
      credID: authenticator.credID,
      fmt: authenticator.fmt,
      publicKey: authenticator.publicKey,
    });

    this.apply(new UserLoggedInWithWebAuthnEvent(user, authenticator));
    if (loggedIn) {
      addSessionUser(req, {
        uuid: user.uuid,
        email: user.email,
        phone: user.phone,
      });
      req.logIn(user, () => {});
    }

    return {
      loggedIn,
      redirect: query.redirect ? query.redirect : '/account',
    };
  }

  async find(actorUuid: string, userUuid: string) {
    await this.validateAuthorizedUser(actorUuid, userUuid);
    return await this.authenticator.find({ userUuid });
  }

  async validateAuthorizedUser(actorUuid: string, userUuid: string) {
    const isAdmin = await this.user.checkAdministrator(actorUuid);
    if (!isAdmin && userUuid !== actorUuid) {
      throw new ForbiddenException();
    }
  }

  async removeAuthenticator(uuid: string, actorUuid: string, userUuid: string) {
    if (!userUuid) userUuid = actorUuid;
    await this.validateAuthorizedUser(actorUuid, userUuid);

    const user = await this.user.findOne({ uuid: userUuid });
    if (!user) throw invalidUserException;

    const authKey = await this.authenticator.findOne({ uuid });
    this.apply(new UserAuthenticatorRemovedEvent(authKey));

    const authenticators = await this.authenticator.find({ userUuid });
    if (authenticators.length === 0 && !user.enable2fa) {
      user.enablePasswordLess = false;
      this.apply(new UserAccountModifiedEvent(user));
    }
  }

  async renameAuthenticator(uuid: string, name: string, actorUuid: string) {
    await this.validateAuthorizedUser(actorUuid, actorUuid);
    const authKey = await this.authenticator.findOne({ uuid });
    authKey.name = name;
    await this.authenticator.save(authKey);
    return { name: authKey.name, uuid: authKey.uuid };
  }

  saveChallenge(user: User, challenge: string) {
    const now = new Date();
    const expiry = now;
    expiry.setMinutes(now.getMinutes() + TEN_NUMBER);

    const authData = {} as AuthData;
    authData.uuid = uuidv4();
    authData.authDataType = AuthDataType.Challenge;
    authData.password = challenge;
    authData.entity = USER;
    authData.entityUuid = user.uuid;
    authData.expiry = expiry;

    return authData;
  }
}
