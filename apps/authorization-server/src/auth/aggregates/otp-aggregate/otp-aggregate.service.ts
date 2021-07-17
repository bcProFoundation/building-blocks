import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AggregateRoot } from '@nestjs/cqrs';
import { retry } from 'rxjs/operators';
import speakeasy from 'speakeasy';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

import { i18n } from '../../../i18n/i18n.config';
import { User } from '../../../user-management/entities/user/user.interface';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { USER } from '../../../user-management/entities/user/user.schema';
import {
  AuthDataType,
  AuthData,
} from '../../../user-management/entities/auth-data/auth-data.interface';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.interface';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { Client } from '../../../client-management/entities/client/client.interface';
import { UserLogInHOTPGeneratedEvent } from '../../events/user-login-hotp-generated/user-login-hotp-generated.event';
import { UserService } from '../../../user-management/entities/user/user.service';
import {
  PhoneAlreadyRegisteredException,
  invalidUserException,
  EventsNotConnectedException,
  invalidOTPException,
  PhoneRegistrationNotAllowedException,
} from '../../../common/filters/exceptions';
import { UnverifiedPhoneAddedEvent } from '../../events/unverified-phone-added/unverified-phone-added.event';
import {
  ConfigService,
  EVENTS_HOST,
  EVENTS_PORT,
  EVENTS_USER,
  EVENTS_PASSWORD,
} from '../../../config/config.service';
import { PhoneVerifiedEvent } from '../../events/phone-verified/phone-verified.event';
import { SignupViaPhoneDto } from '../../../user-management/policies';
import { UserAccountAddedEvent } from '../../../user-management/events/user-account-added/user-account-added.event';
import { addSessionUser } from '../../guards/guard.utils';

@Injectable()
export class OTPAggregateService extends AggregateRoot {
  private settings: ServerSettings;
  private otp: AuthData;

  constructor(
    private readonly http: HttpService,
    private readonly authData: AuthDataService,
    private readonly serverSettings: ServerSettingsService,
    private readonly clientService: ClientService,
    private readonly user: UserService,
    private readonly config: ConfigService,
  ) {
    super();
  }

  async sendLoginOTP(user: User) {
    this.settings = await this.serverSettings.find();

    const communicationClient = await this.clientService.findOne({
      clientId: this.settings.communicationServerClientId,
    });
    if (!communicationClient) return Promise.resolve();

    const hotp = await this.generateHOTP(user);

    // Send Email
    this.sendEmail(communicationClient, user, hotp);

    // Broadcast Event for SMS Services
    this.apply(new UserLogInHOTPGeneratedEvent(user, hotp));
  }

  async checkLocalOTP(user: User) {
    this.otp = await this.authData.findOne({
      entity: USER,
      entityUuid: user.uuid,
      authDataType: AuthDataType.LoginOTP,
    });

    if (!this.otp) {
      this.otp = {} as AuthData;

      await this.generateLoginOTP(user);
    } else if (this.otp) {
      // check expired?
      if (this.otp.expiry <= new Date()) {
        // Generate new
        await this.generateLoginOTP(user);
      }
    }
  }

  async generateLoginOTP(user: User) {
    const secret = speakeasy.generateSecret({
      name: user.email || user.phone,
    });

    this.otp.metaData = {
      counter: Math.floor(Math.random() * 100),
      secret: secret.base32,
    };
    this.otp.entity = USER;
    this.otp.entityUuid = user.uuid;
    this.otp.authDataType = AuthDataType.LoginOTP;

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + this.settings.otpExpiry);
    this.otp.expiry = expiry;

    await this.authData.save(this.otp);
  }

  async generateHOTP(user: User): Promise<string> {
    await this.checkLocalOTP(user);
    return speakeasy.hotp({
      secret: this.otp.metaData.secret,
      encoding: 'base32',
      counter: this.otp.metaData.counter,
    });
  }

  sendEmail(communicationClient: Client, user: User, hotp: string) {
    const communicationUrl = new URL(communicationClient.redirectUris[0]);
    const requestUrl = communicationUrl.origin + '/email/v1/system';

    let txtMessage = 'OTP for login for ' + user.email + ' is ' + hotp + '\n';
    txtMessage += 'OTP expires at ' + this.otp.expiry + '. Do not share otp.';

    this.http
      .post(
        requestUrl,
        {
          emailTo: user.email,
          subject: i18n.__('OTP For Login for ') + user.email,
          text: txtMessage,
          html: txtMessage,
        },
        {
          auth: {
            username: communicationClient.clientId,
            password: communicationClient.clientSecret,
          },
        },
      )
      .pipe(retry(3))
      .subscribe({
        next: success => {},
        error: error => {},
      });
  }

  async addUnverifiedPhone(userUuid: string, unverifiedPhone: string) {
    this.verifyConnectedEvents();
    await this.checkPhoneAlreadyRegistered(unverifiedPhone);

    const user = await this.user.findOne({ uuid: userUuid });
    if (!user) throw invalidUserException;

    // Generate OTP and broadcast Event
    const phoneOTP = await this.getPhoneVerificationCode(user, unverifiedPhone);

    const hotp = speakeasy.hotp({
      secret: phoneOTP.metaData.secret,
      encoding: 'base32',
      counter: phoneOTP.metaData.counter,
    });

    this.apply(new UnverifiedPhoneAddedEvent(user, phoneOTP, hotp));
  }

  async checkLocalPhoneVerificationCode(user: User) {
    return await this.authData.findOne({
      entity: USER,
      entityUuid: user.uuid,
      authDataType: AuthDataType.PhoneVerificationCode,
    });
  }

  verifyConnectedEvents() {
    let isEventsConnected = false;

    if (
      this.config.get(EVENTS_HOST) &&
      this.config.get(EVENTS_PORT) &&
      this.config.get(EVENTS_USER) &&
      this.config.get(EVENTS_PASSWORD)
    ) {
      isEventsConnected = true;
    }

    if (!isEventsConnected) {
      throw new EventsNotConnectedException();
    }
  }

  async checkPhoneAlreadyRegistered(unverifiedPhone: string) {
    const existingPhoneUser = await this.user.findOne({
      phone: unverifiedPhone,
    });
    if (existingPhoneUser) {
      throw new PhoneAlreadyRegisteredException();
    }
  }

  async getPhoneVerificationCode(user: User, unverifiedPhone: string) {
    this.settings = await this.serverSettings.find();
    // Check server settings for enableUserPhone
    if (!this.settings.enableUserPhone) {
      throw new PhoneRegistrationNotAllowedException();
    }

    const phoneOTP = await this.checkLocalPhoneVerificationCode(user);
    if (phoneOTP) {
      return phoneOTP;
    }

    const newPhoneOTP = {} as AuthData;
    const secret = speakeasy.generateSecret({
      name: user.email || user.phone || user.unverifiedPhone,
    });

    newPhoneOTP.metaData = {
      counter: Math.floor(Math.random() * 100),
      secret: secret.base32,
      phone: unverifiedPhone,
    };
    newPhoneOTP.entity = USER;
    newPhoneOTP.entityUuid = user.uuid;
    newPhoneOTP.authDataType = AuthDataType.PhoneVerificationCode;

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + this.settings.otpExpiry);
    newPhoneOTP.expiry = expiry;

    return newPhoneOTP;
  }

  async verifyPhone(userUuid: string, otp: string, req?: Request) {
    // Check user
    const user = await this.user.findOne({ uuid: userUuid });
    if (!user) throw invalidUserException;

    // check local otp
    const phoneOTP = await this.checkLocalPhoneVerificationCode(user);
    if (!phoneOTP) {
      throw invalidOTPException;
    }
    if (phoneOTP && phoneOTP.expiry < new Date()) {
      throw invalidOTPException;
    }

    const phone = phoneOTP.metaData.phone as string;

    // validate otp with payload otp
    const hotp = speakeasy.hotp({
      secret: phoneOTP.metaData.secret,
      encoding: 'base32',
      counter: phoneOTP.metaData.counter,
    });
    if (hotp !== otp) {
      throw invalidOTPException;
    }

    // check already registered phone
    await this.checkPhoneAlreadyRegistered(phone);

    // set phone
    user.phone = phone;
    user.unverifiedPhone = undefined;

    // set user enabled
    user.disabled = false;

    // Login as user
    if (req && req.logIn) {
      addSessionUser(req, user);
      req.logIn(user, () => {});
    }

    this.apply(new PhoneVerifiedEvent(user, phoneOTP));
  }

  async signupViaPhone(payload: SignupViaPhoneDto) {
    await this.checkPhoneAlreadyRegistered(payload.unverifiedPhone);

    // Check if sending sms is available
    this.verifyConnectedEvents();
    this.settings = await this.serverSettings.find();
    if (!this.settings.enableUserPhone) {
      throw new PhoneRegistrationNotAllowedException();
    }

    const unverifiedUser =
      (await this.getUnverifiedPhoneIfAlreadyRegistered(
        payload.unverifiedPhone,
      )) || ({} as User);

    if (!unverifiedUser.uuid) {
      unverifiedUser.uuid = uuidv4();
    }

    unverifiedUser.name = payload.name;
    unverifiedUser.unverifiedPhone = payload.unverifiedPhone;
    unverifiedUser.enablePasswordLess = true;
    unverifiedUser.disabled = true;
    unverifiedUser.creation = new Date();

    this.apply(new UserAccountAddedEvent(unverifiedUser));

    // Generate OTP and broadcast Event
    const phoneOTP = await this.getPhoneVerificationCode(
      unverifiedUser,
      unverifiedUser.unverifiedPhone,
    );

    const hotp = speakeasy.hotp({
      secret: phoneOTP.metaData.secret,
      encoding: 'base32',
      counter: phoneOTP.metaData.counter,
    });

    this.apply(new UnverifiedPhoneAddedEvent(unverifiedUser, phoneOTP, hotp));

    return payload;
  }

  async getUnverifiedPhoneIfAlreadyRegistered(unverifiedPhone: string) {
    return await this.user.findOne({ unverifiedPhone });
  }
}
