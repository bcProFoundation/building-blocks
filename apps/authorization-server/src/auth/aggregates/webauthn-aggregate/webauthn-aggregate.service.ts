import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import {
  generateAttestationOptions,
  verifyAttestationResponse,
  generateAssertionOptions,
  verifyAssertionResponse,
} from '@simplewebauthn/server';
import { v4 as uuidv4 } from 'uuid';
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
import {
  UserAuthenticator,
  Fmt,
} from '../../../user-management/entities/user-authenticator/user-authenticator.interface';
import { invalidUserException } from '../../../common/filters/exceptions';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { addSessionUser } from '../../guards/guard.utils';
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
    const relyingParty = await this.getRelyingParty();

    await this.validateAuthorizedUser(actorUuid, userUuid);

    if (!userUuid) userUuid = actorUuid;

    const user = await this.user.findOne({ uuid: userUuid });
    if (!user) throw new ForbiddenException();

    const authenticators = await this.authenticator.find({
      userUuid: user.uuid,
    });

    const challengeResponse = generateAttestationOptions({
      rpName: relyingParty.name,
      rpID: relyingParty.id,
      userID: user.uuid,
      userName: user.email || user.phone,
      userDisplayName: user.name,
      // Don't prompt users for additional information about the authenticator
      // (Recommended for smoother UX)
      attestationType: 'indirect',
      // Prevent users from re-registering existing authenticators
      excludeCredentials: authenticators.map(cred => {
        return {
          id: Buffer.from(cred.credID, 'base64'),
          type: 'public-key',
        };
      }),
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

  async register(body, actorUuid: string) {
    const user = await this.user.findOne({ uuid: actorUuid });
    const challenge = this.getChallengeFromClientData(
      body.response.clientDataJSON,
    );

    const authData = await this.authData.findOne({
      entity: USER,
      entityUuid: user?.uuid,
      authDataType: AuthDataType.Challenge,
      password: challenge,
    });

    if (!authData) {
      throw new ForbiddenException();
    }

    const relyingParty = await this.getRelyingParty();

    try {
      const verification = await verifyAttestationResponse({
        credential: body,
        expectedChallenge: authData?.password,
        expectedOrigin: relyingParty.origin,
        expectedRPID: relyingParty.id,
      });

      const userUuid = authData.entityUuid;

      await this.authData.remove(authData);

      const authenticator = {} as UserAuthenticator;
      const deviceInfo = verification?.attestationInfo;
      authenticator.uuid = uuidv4();
      authenticator.credID = this.urlString(
        deviceInfo?.credentialID?.toString('base64'),
      );
      authenticator.fmt = (deviceInfo.fmt as unknown) as Fmt;
      authenticator.publicKey = this.urlString(
        deviceInfo?.credentialPublicKey.toString('base64'),
      );
      authenticator.counter = deviceInfo.counter;
      authenticator.userUuid = userUuid;

      this.apply(new WebAuthnKeyRegisteredEvent(authenticator));

      return { registered: authenticator.uuid };
    } catch (error) {
      throw new BadRequestException(error);
    }
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

    const options = generateAssertionOptions({
      // Require users to use a previously-registered authenticator
      allowCredentials: authenticators.map(cred => ({
        id: Buffer.from(cred.credID, 'base64'),
        type: 'public-key',
        // Optional
        transports: ['ble', 'internal', 'usb', 'nfc'],
      })),

      userVerification: 'preferred',
    });

    const authData = this.saveChallenge(user, options.challenge);
    this.apply(
      new WebAuthnKeyChallengeRequestedEvent(
        authData,
        WebauthnChallengeType.Login,
      ),
    );

    return options;
  }

  async loginChallenge(req) {
    const { body, query } = req;

    const challenge = this.getChallengeFromClientData(
      body.response.clientDataJSON,
    );
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

    const relyingParty = await this.getRelyingParty();

    try {
      const verification = await verifyAssertionResponse({
        credential: body,
        expectedChallenge: authChallenge.password,
        expectedOrigin: relyingParty.origin,
        expectedRPID: relyingParty.id,
        authenticator: {
          credentialPublicKey: Buffer.from(authenticator.publicKey, 'base64'),
          credentialID: Buffer.from(authenticator.credID, 'base64'),
          counter: authenticator.counter,
        },
      });

      await this.authData.remove(authChallenge);
      const { verified, assertionInfo } = verification;
      await this.authenticator.updateOne(
        { uuid: authenticator.uuid },
        { $set: { counter: assertionInfo.newCounter } },
      );
      authenticator.counter = assertionInfo.newCounter;

      this.apply(new UserLoggedInWithWebAuthnEvent(user, authenticator));
      if (verified) {
        addSessionUser(req, {
          uuid: user.uuid,
          email: user.email,
          phone: user.phone,
        });
        req.logIn(user, () => {});
      }
      return {
        verified,
        redirect: query.redirect ? query.redirect : '/account',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
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

  async getRelyingParty() {
    const settings = await this.settings.findWithoutError();
    const partyName = settings.organizationName || SERVICE;
    const issuerUrl = settings.issuerUrl;

    const relyingParty: { name: string; id?: string; origin?: string } = {
      name: partyName,
    };
    if (issuerUrl && this.config.get(NODE_ENV) === 'production') {
      try {
        relyingParty.id = new URL(issuerUrl).hostname;
        relyingParty.origin = `https://${relyingParty.id}`;
      } catch (error) {}
    } else if (issuerUrl && this.config.get(NODE_ENV) === 'development') {
      relyingParty.id = 'accounts.localhost';
      relyingParty.origin = `http://${relyingParty.id}:4210`;
    }
    return relyingParty;
  }

  getChallengeFromClientData(clientDataJSON) {
    const clientDataBuffer = Buffer.from(clientDataJSON, 'base64');
    const clientData = JSON.parse(clientDataBuffer.toString());
    const challenge = Buffer.from(clientData.challenge, 'base64');
    return this.urlString(challenge.toString('base64'));
  }

  urlString(str: string) {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
}
