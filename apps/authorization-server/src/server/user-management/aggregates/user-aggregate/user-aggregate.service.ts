import { Injectable, BadRequestException } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { UserService } from '../../entities/user/user.service';
import { User } from '../../entities/user/user.interface';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';
import { AuthData } from '../..//entities/auth-data/auth-data.interface';
import {
  twoFactorEnabledException,
  twoFactorNotEnabledException,
  invalidOTPException,
  invalidUserException,
} from '../../../common/filters/exceptions';
import { i18n } from '../../../i18n/i18n.config';
import { CryptographerService } from '../../../common/cryptographer.service';
import { AggregateRoot } from '@nestjs/cqrs';
import { ChangePasswordDto, VerifyEmailDto } from '../../policies';
import { PasswordChangedEvent } from '../../events/password-changed/password-changed.event';
import { PasswordPolicyService } from '../../policies/password-policy/password-policy.service';
import { EmailVerifiedAndPasswordSetEvent } from '../../events/email-verified-and-password-set/email-verified-and-password-set.event';

@Injectable()
export class UserAggregateService extends AggregateRoot {
  constructor(
    private readonly user: UserService,
    private readonly authData: AuthDataService,
    private readonly settings: ServerSettingsService,
    private readonly crypto: CryptographerService,
    private readonly passwordPolicy: PasswordPolicyService,
  ) {
    super();
  }

  async initializeMfa(uuid: string, restart: boolean = false) {
    const user: User = await this.user.findOne({ uuid });

    // Disable 2FA for admin in env staging
    if (
      process.env.NODE_ENV === 'staging' &&
      user.roles.includes(ADMINISTRATOR)
    ) {
      return { environment: process.env.NODE_ENV };
    }

    if (restart || !user.enable2fa) {
      const settings = await this.settings.find();
      const secret = speakeasy.generateSecret({ name: user.email });
      // Save secret on AuthData

      if (user.twoFactorTempSecret) {
        const twoFactorTempSecret = await this.authData.getModel().findOne({
          uuid: user.twoFactorTempSecret,
        });
        if (twoFactorTempSecret) await twoFactorTempSecret.remove();
        user.twoFactorTempSecret = null;
      }

      const authData: AuthData = new (this.authData.getModel())();
      authData.password = secret.base32;
      await authData.save();
      user.twoFactorTempSecret = authData.uuid;
      await user.save();

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
        key: authData.password,
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
      const twoFactorTempSecret = await this.authData.findOne({
        uuid: user.twoFactorTempSecret,
      });
      const base32secret = twoFactorTempSecret.password;
      const verified = speakeasy.totp({
        secret: base32secret,
        encoding: 'base32',
      });
      if (verified === otp) {
        const sharedSecret: AuthData = new (this.authData.getModel())();
        sharedSecret.password = twoFactorTempSecret.password;
        await sharedSecret.save();

        user.sharedSecret = sharedSecret.uuid;
        user.enable2fa = true;

        user.twoFactorTempSecret = null;
        await twoFactorTempSecret.remove();

        await user.save();

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

    const twoFactorTempSecret = await this.authData.findOne({
      uuid: user.twoFactorTempSecret,
    });
    if (twoFactorTempSecret) await twoFactorTempSecret.remove();

    const sharedSecret = await this.authData.findOne({
      uuid: user.sharedSecret,
    });
    if (sharedSecret) await sharedSecret.remove();

    user.twoFactorTempSecret = null;
    user.sharedSecret = null;
    await user.save();
    return { message: i18n.__('2FA Disabled') };
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
    const userPassword = new (this.authData.getModel())();
    userPassword.password = this.crypto.hashPassword(payload.password);
    verifiedUser.password = userPassword.uuid;
    verifiedUser.disabled = false;
    verifiedUser.verificationCode = undefined;
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
        result.errors.length > 0 ? result.errors : 'Invalid Password';
      throw new BadRequestException(errors);
    }
  }
}
