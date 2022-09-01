import { Injectable, BadRequestException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { AggregateRoot } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';

import { UserService } from '../../entities/user/user.service';
import { User } from '../../entities/user/user.interface';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { i18n } from '../../../i18n/i18n.config';
import { SignupViaEmailDto, SignupViaEmailNoVerifiedDto } from '../../policies';
import {
  AuthData,
  AuthDataType,
} from '../../entities/auth-data/auth-data.interface';
import {
  EmailForVerificationNotFound,
  invalidUserException,
  userAlreadyExistsException,
} from '../../../common/filters/exceptions';
import { USER } from '../../entities/user/user.schema';
import { UserSignedUpViaEmailEvent } from '../../events/user-signed-up-via-email/user-signed-up-via-email.event';
import { UserSignedUpViaEmailNoVerifiedEvent } from '../../events/user-signed-up-via-email-no-verified/user-signed-up-via-email-no-verified.event';
import { UnverifiedEmailVerificationCodeSentEvent } from '../../events';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';
import { PasswordPolicyService } from '../../policies/password-policy/password-policy.service';
import { CryptographerService } from '../../../common/services/cryptographer/cryptographer.service';

@Injectable()
export class SignupService extends AggregateRoot {
  constructor(
    private readonly user: UserService,
    private readonly authData: AuthDataService,
    private readonly serverSettingsService: ServerSettingsService,
    private readonly passwordPolicy: PasswordPolicyService,
    private readonly crypto: CryptographerService,
  ) {
    super();
  }

  async initSignupViaEmail(payload: SignupViaEmailDto) {
    await this.validateSignupEnabled();

    payload.email = payload.email.trim().toLowerCase();
    const user = await this.user.findOne({ email: payload.email });
    if (user) {
      throw userAlreadyExistsException;
    }

    const unverifiedUser = {} as User;
    unverifiedUser.uuid = uuidv4();
    unverifiedUser.name = payload.name;
    unverifiedUser.email = payload.email;
    unverifiedUser.disabled = true;
    unverifiedUser.isEmailVerified = false;

    const verificationCode = {} as AuthData;
    verificationCode.password = randomBytes(32).toString('hex');
    verificationCode.entity = USER;
    verificationCode.entityUuid = unverifiedUser.uuid;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 1);
    verificationCode.expiry = new Date();
    verificationCode.authDataType = AuthDataType.VerificationCode;

    this.apply(new UserSignedUpViaEmailEvent(unverifiedUser, verificationCode));
  }

  async validateSignupEnabled() {
    const settings = await this.serverSettingsService.find();
    if (settings.disableSignup) {
      throw new BadRequestException({
        message: i18n.__('Signup Disabled'),
      });
    }
  }

  async sendUnverifiedEmailVerificationCode(userUuid: string) {
    const user = await this.user.findOne({ uuid: userUuid });
    if (!user) {
      throw invalidUserException;
    }
    if (user.isEmailVerified) {
      throw new EmailForVerificationNotFound();
    }

    const verificationCode =
      (await this.authData.findOne({
        entity: USER,
        entityUuid: user.uuid,
        authDataType: AuthDataType.VerificationCode,
      })) || ({} as AuthData);

    verificationCode.entity = USER;
    verificationCode.entityUuid = user.uuid;
    verificationCode.authDataType = AuthDataType.VerificationCode;

    if (!verificationCode.password) {
      verificationCode.password = randomBytes(32).toString('hex');
    }

    if (!verificationCode.expiry) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 1);
      verificationCode.expiry = new Date();
    }

    this.apply(
      new UnverifiedEmailVerificationCodeSentEvent(user, verificationCode),
    );
  }

  async initSignupViaEmailNoVerified(payload: SignupViaEmailNoVerifiedDto) {
    await this.validateSignupEnabled();

    payload.email = payload.email.trim().toLowerCase();
    const user = await this.user.findOne({ email: payload.email });
    if (user) {
      throw userAlreadyExistsException;
    }
    const result = this.passwordPolicy.validatePassword(payload.password);
    if (result.errors.length > 0) {
      throw new BadRequestException(result.errors);
    }

    const verifiedUser = {} as User;
    verifiedUser.uuid = uuidv4();
    verifiedUser.name = payload.name;
    verifiedUser.email = payload.email;
    verifiedUser.disabled = false;
    verifiedUser.isEmailVerified = true;

    const userPassword = {} as AuthData & { _id: any };
    userPassword.authDataType = AuthDataType.Password;
    userPassword.uuid = uuidv4();
    userPassword.entity = USER;
    userPassword.entityUuid = verifiedUser.uuid;
    userPassword.password = this.crypto.hashPassword(payload.password);

    verifiedUser.password = userPassword.uuid;

    this.apply(new UserSignedUpViaEmailNoVerifiedEvent(verifiedUser, userPassword));
  }
}