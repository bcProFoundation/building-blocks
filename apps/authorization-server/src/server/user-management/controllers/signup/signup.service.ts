import { Injectable, HttpService } from '@nestjs/common';
import { UserService } from '../../../user-management/entities/user/user.service';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { randomBytes } from 'crypto';
import { User } from '../../../user-management/entities/user/user.interface';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { invalidUserException } from '../../../common/filters/exceptions';
import { CryptographerService } from '../../../common/cryptographer.service';

@Injectable()
export class SignupService {
  constructor(
    private readonly http: HttpService,
    private readonly userService: UserService,
    private readonly serverSettingsService: ServerSettingsService,
    private readonly clientService: ClientService,
    private readonly cryptoService: CryptographerService,
    private readonly authDataService: AuthDataService,
  ) {}

  async initSignup(payload, res) {
    const unverifiedUser = new (this.userService.getModel())();
    unverifiedUser.name = payload.name;
    unverifiedUser.email = payload.email;
    unverifiedUser.disabled = true;
    unverifiedUser.verificationCode = randomBytes(32).toString('hex');
    await this.userService.save(unverifiedUser);
    await this.emailRequest(unverifiedUser, res);
    return { message: res.__('Please check your email to complete signup') };
  }

  async emailRequest(unverifiedUser: User, res) {
    // Send Email
    const settings = await this.serverSettingsService.find();
    const communicationClient = await this.clientService.findOne({
      clientId: settings.communicationServerClientId,
    });
    const baseEncodedCred = Buffer.from(
      communicationClient.clientId + ':' + communicationClient.clientSecret,
    ).toString('base64');

    const requestUrl =
      new URL(communicationClient.redirectUris[0]).origin + '/email/v1/system';

    const verificationUrl =
      settings.issuerUrl + '/signup/' + unverifiedUser.verificationCode;
    const txtMessage =
      'Visit the following link to complete signup\n' + verificationUrl;
    const htmlMessage = `To complete signup <a href='${verificationUrl}'>click here</a>`;
    this.http
      .post(
        requestUrl,
        {
          emailTo: unverifiedUser.email,
          subject:
            res.__('Please complete sign up for ') + unverifiedUser.email,
          text: txtMessage,
          html: htmlMessage,
        },
        {
          headers: {
            authorization: 'Basic ' + baseEncodedCred,
          },
        },
      )
      .subscribe({
        next: response => {
          return response;
        },
        error: async err => {
          await unverifiedUser.remove();
        },
      });
  }

  async verifyEmail(payload, res) {
    const verifiedUser = await this.userService.findOne({
      verificationCode: payload.verificationCode,
    });
    if (!verifiedUser) throw invalidUserException;
    const userPassword = new (this.authDataService.getModel())();
    userPassword.password = this.cryptoService.hashPassword(payload.password);
    await userPassword.save();
    verifiedUser.password = userPassword.uuid;
    verifiedUser.disabled = false;
    verifiedUser.verificationCode = undefined;
    verifiedUser.save();
    return { message: res.__('Password set successfully') };
  }
}
