import { Injectable, HttpService } from '@nestjs/common';
import { retry } from 'rxjs/operators';
import * as speakeasy from 'speakeasy';
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

@Injectable()
export class OTPAggregateService {
  private settings: ServerSettings;
  private otp: AuthData;

  constructor(
    private readonly http: HttpService,
    private readonly authData: AuthDataService,
    private readonly serverSettings: ServerSettingsService,
    private readonly clientService: ClientService,
  ) {}

  async sendLoginOTP(user: User) {
    this.settings = await this.serverSettings.find();

    const communicationClient = await this.clientService.findOne({
      clientId: this.settings.communicationServerClientId,
    });
    if (!communicationClient) return Promise.resolve();

    const requestUrl =
      new URL(communicationClient.redirectUris[0]).origin + '/email/v1/system';

    this.otp = await this.checkLocalOTP(user);

    if (!this.otp) {
      const AuthDataModel = this.authData.getModel();
      this.otp = new AuthDataModel();

      await this.generateLoginOTP(user);
    } else if (this.otp) {
      // check expired?
      if (this.otp.expiry <= new Date()) {
        // Generate new
        await this.generateLoginOTP(user);
      }
    }

    const sharedSecret = await this.authData.findOne({
      uuid: user.sharedSecret,
    });
    const hotp = speakeasy.hotp({
      secret: sharedSecret.password,
      encoding: 'base32',
      counter: this.otp.password,
    });

    let txtMessage = 'OTP for login for ' + user.email + ' is ' + hotp + '\n';
    txtMessage += 'OTP expires at ' + this.otp.expiry;

    // Send Email
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

    // Send SMS
    // if(user.phone) {
    //     this.http.post('', { otp: this.otp.password, phone: user.phone })
    //         .pipe(retry(3))
    //         .subscribe({
    //             next: success => {},
    //             error: error => {},
    //         });
    // }
  }

  async checkLocalOTP(user: User) {
    return await this.authData.findOne({
      entity: USER,
      entityUuid: user.uuid,
      authDataType: AuthDataType.LoginOTP,
    });
  }

  async generateLoginOTP(user: User) {
    this.otp.password = Math.floor(Math.random() * 100);
    this.otp.entity = USER;
    this.otp.entityUuid = user.uuid;
    this.otp.authDataType = AuthDataType.LoginOTP;

    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + this.settings.otpExpiry);
    this.otp.expiry = expiry;

    await this.otp.save();
  }
}
