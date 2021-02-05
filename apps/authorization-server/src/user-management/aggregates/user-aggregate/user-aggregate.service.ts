import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { UserService } from '../../entities/user/user.service';
import { User } from '../../entities/user/user.interface';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';
import {
  AuthDataType,
  AuthData,
} from '../../entities/auth-data/auth-data.interface';
import {
  twoFactorEnabledException,
  twoFactorNotEnabledException,
  invalidOTPException,
  invalidUserException,
  passwordLessLoginAlreadyEnabledException,
  passwordLessLoginNotEnabledException,
  CommunicationServerNotFoundException,
} from '../../../common/filters/exceptions';
import { CryptographerService } from '../../../common/services/cryptographer/cryptographer.service';
import {
  ChangePasswordDto,
  VerifyEmailDto,
  VerifySignupViaPhoneDto,
} from '../../policies';
import { PasswordChangedEvent } from '../../events/password-changed/password-changed.event';
import { PasswordPolicyService } from '../../policies/password-policy/password-policy.service';
import { EmailVerifiedAndPasswordSetEvent } from '../../events/email-verified-and-password-set/email-verified-and-password-set.event';
import { UserAccountModifiedEvent } from '../../events/user-account-modified/user-account-modified.event';
import { USER } from '../../entities/user/user.schema';
import { AuthDataRemovedEvent } from '../../events/auth-data-removed/auth-data-removed.event';
import { i18n } from '../../../i18n/i18n.config';
import { UserAuthenticatorService } from '../../entities/user-authenticator/user-authenticator.service';
import { ConfigService, NODE_ENV } from '../../../config/config.service';

@Injectable()
export class UserAggregateService extends AggregateRoot {
  constructor(
    private readonly user: UserService,
    private readonly authData: AuthDataService,
    private readonly settings: ServerSettingsService,
    private readonly crypto: CryptographerService,
    private readonly passwordPolicy: PasswordPolicyService,
    private readonly authenticator: UserAuthenticatorService,
    private readonly config: ConfigService,
  ) {
    super();
  }

  async initializeMfa(uuid: string, restart: boolean = false) {
    const user: User = await this.user.findOne({ uuid });
    const environment = this.config.get(NODE_ENV);
    // Disable 2FA for admin in env staging
    if (environment === 'staging' && user.roles.includes(ADMINISTRATOR)) {
      return { environment };
    }

    if (restart || !user.enable2fa) {
      const settings = await this.settings.find();

      // Save secret on AuthData
      const secret = speakeasy.generateSecret({ name: user.email });

      // Find existing AuthData or create new
      let twoFactorTempSecret = await this.checkLocalAuthData(
        user.uuid,
        AuthDataType.TwoFactorTempSecret,
      );
      if (!twoFactorTempSecret) {
        twoFactorTempSecret = this.getNewAuthData(
          user.uuid,
          AuthDataType.TwoFactorTempSecret,
        );
        user.twoFactorTempSecret = twoFactorTempSecret.uuid;
      }

      // Save generated base32 secret
      twoFactorTempSecret.password = secret.base32;
      this.apply(new PasswordChangedEvent(twoFactorTempSecret));
      this.apply(new UserAccountModifiedEvent(user));

      const issuerUrl = new URL(settings.issuerUrl).host;
      const otpAuthUrl = speakeasy.otpauthURL({
        secret: secret.ascii,
        label: `${issuerUrl}:${user.email}`,
        period: 30,
      });

      const qrImage = await QRCode.toDataURL(otpAuthUrl);

      return {
        qrImage,
        // shared key from AuthData
        key: twoFactorTempSecret.password,
      };
    } else {
      throw twoFactorEnabledException;
    }
  }

  async getUserSaltedHashPassword(uuid: string) {
    const user = await this.user.findOne({ uuid });
    const authData = await this.authData.findOne({ uuid: user.password });
    return authData;
  }

  async verify2fa(uuid: string, otp: string) {
    const user = await this.user.findOne({ uuid });
    if (!otp) throw invalidOTPException;
    if (user.twoFactorTempSecret) {
      const twoFactorTempSecret = await this.checkLocalAuthData(
        user.uuid,
        AuthDataType.TwoFactorTempSecret,
      );
      const base32secret = twoFactorTempSecret.password;
      const verified = speakeasy.totp.verify({
        secret: base32secret,
        encoding: 'base32',
        token: otp,
        window: 2,
      });
      if (verified) {
        const sharedSecret = await this.checkLocalAuthData(
          user.uuid,
          AuthDataType.SharedSecret,
        );
        if (sharedSecret) {
          this.apply(new AuthDataRemovedEvent(sharedSecret));
        }

        user.sharedSecret = twoFactorTempSecret.uuid;
        twoFactorTempSecret.authDataType = AuthDataType.SharedSecret;
        user.enable2fa = true;
        user.twoFactorTempSecret = undefined;
        this.apply(new PasswordChangedEvent(twoFactorTempSecret));
        this.apply(new UserAccountModifiedEvent(user));

        return {
          user: {
            uuid: user.uuid,
            email: user.email,
            phone: user.phone,
          },
        };
      } else throw twoFactorNotEnabledException;
    }
  }

  async disable2fa(uuid: string) {
    const user = await this.user.findOne({ uuid });
    if (!user.enable2fa) throw twoFactorNotEnabledException;
    user.enable2fa = false;

    const authenticators = await this.authenticator.find({
      userUuid: user.uuid,
    });
    if (authenticators.length === 0) {
      user.enablePasswordLess = false;
    }

    const sharedSecret = await this.checkLocalAuthData(
      user.uuid,
      AuthDataType.SharedSecret,
    );
    if (sharedSecret) {
      this.apply(new AuthDataRemovedEvent(sharedSecret));
    }

    const twoFactorTempSecret = await this.checkLocalAuthData(
      user.uuid,
      AuthDataType.SharedSecret,
    );
    if (twoFactorTempSecret) {
      this.apply(new AuthDataRemovedEvent(sharedSecret));
    }

    user.twoFactorTempSecret = undefined;
    user.sharedSecret = undefined;
    this.apply(new UserAccountModifiedEvent(user));
  }

  async verifyEmail(payload: VerifyEmailDto) {
    const result = this.passwordPolicy.validatePassword(payload.password);
    if (result.errors.length > 0) {
      throw new BadRequestException(result.errors);
    }

    const verifiedUser = await this.user.findOne({
      verificationCode: payload.verificationCode,
    });
    if (!verifiedUser) throw invalidUserException;

    let userPassword = await this.authData.findOne({
      uuid: verifiedUser.password,
    });
    if (!userPassword) {
      userPassword = {} as AuthData;
      userPassword.authDataType = AuthDataType.Password;
      userPassword.uuid = uuidv4();
    }

    userPassword.entity = USER;
    userPassword.entityUuid = verifiedUser.uuid;
    userPassword.password = this.crypto.hashPassword(payload.password);
    verifiedUser.password = userPassword.uuid;
    verifiedUser.disabled = false;
    verifiedUser.verificationCode = undefined;
    verifiedUser.isEmailVerified = true;
    this.apply(
      new EmailVerifiedAndPasswordSetEvent(verifiedUser, userPassword),
    );
  }

  async validatePassword(userUuid: string, passwordPayload: ChangePasswordDto) {
    const authData = await this.getUserSaltedHashPassword(userUuid);
    const validPassword = this.crypto.checkPassword(
      authData.password,
      passwordPayload.currentPassword,
    );
    const result = this.passwordPolicy.validatePassword(
      passwordPayload.newPassword,
    );
    if (validPassword && result.errors.length === 0) {
      authData.password = this.crypto.hashPassword(passwordPayload.newPassword);
      this.apply(new PasswordChangedEvent(authData));
    } else {
      const errors =
        result.errors.length > 0 ? result.errors : i18n.__('Invalid Password');
      throw new BadRequestException(errors);
    }
  }

  async enablePasswordLessLogin(actorUuid: string, userUuid: string) {
    const settings = await this.settings.find();
    if (!settings.communicationServerClientId) {
      throw new CommunicationServerNotFoundException();
    }

    const user = await this.user.findOne({ uuid: userUuid });
    if (!user) throw invalidUserException;
    await this.validateAdminActor(actorUuid, userUuid);
    if (user.enablePasswordLess) throw passwordLessLoginAlreadyEnabledException;
    user.enablePasswordLess = true;
    this.apply(new UserAccountModifiedEvent(user));
    return user;
  }

  async disablePasswordLessLogin(actorUuid: string, userUuid: string) {
    const user = await this.user.findOne({ uuid: userUuid });
    if (!user) throw invalidUserException;
    await this.validateAdminActor(actorUuid, userUuid);
    if (!user.enablePasswordLess) throw passwordLessLoginNotEnabledException;
    user.enablePasswordLess = false;
    this.apply(new UserAccountModifiedEvent(user));
    return user;
  }

  async checkLocalAuthData(userEntityUuid: string, authDataType: AuthDataType) {
    return await this.authData.findOne({
      entity: USER,
      entityUuid: userEntityUuid,
      authDataType,
    });
  }

  getNewAuthData(userEntityUuid: string, authDataType: AuthDataType) {
    const authData = {} as AuthData;
    authData.uuid = uuidv4();
    authData.entityUuid = userEntityUuid;
    authData.entity = USER;
    authData.authDataType = authDataType;
    return authData;
  }

  async validateAdminActor(actorUuid: string, userUuid: string) {
    const isAdmin = await this.user.checkAdministrator(actorUuid);
    if (!isAdmin && actorUuid !== userUuid) {
      throw new ForbiddenException();
    }
  }

  async verifyPhone(payload: VerifySignupViaPhoneDto) {}
}
