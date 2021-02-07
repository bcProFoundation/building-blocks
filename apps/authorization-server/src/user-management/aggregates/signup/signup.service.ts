import { Injectable, BadRequestException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { AggregateRoot } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';

import { UserService } from '../../entities/user/user.service';
import { User } from '../../entities/user/user.interface';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { i18n } from '../../../i18n/i18n.config';
import { SignupViaEmailDto } from '../../policies';
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
import { UnverifiedEmailVerificationCodeSentEvent } from '../../events';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';

@Injectable()
export class SignupService extends AggregateRoot {
  constructor(
    private readonly user: UserService,
    private readonly authData: AuthDataService,
    private readonly serverSettingsService: ServerSettingsService,
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
}
