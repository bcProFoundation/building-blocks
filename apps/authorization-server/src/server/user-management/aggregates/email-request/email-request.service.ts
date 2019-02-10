import { Injectable, HttpService } from '@nestjs/common';
import { User } from '../../../user-management/entities/user/user.interface';
import { from } from 'rxjs';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { switchMap } from 'rxjs/operators';
import { ClientService } from '../../../client-management/entities/client/client.service';

@Injectable()
export class EmailRequestService {
  constructor(
    private readonly http: HttpService,
    private readonly settings: ServerSettingsService,
    private readonly client: ClientService,
  ) {}

  emailVerificationCode(user: User) {
    // Send Email
    let generateForgottenPasswordUrl: string;
    return from(this.settings.find()).pipe(
      switchMap(settings => {
        generateForgottenPasswordUrl =
          settings.issuerUrl + '/forgot/' + user.verificationCode;
        return from(
          this.client.findOne({
            clientId: settings.communicationServerClientId,
          }),
        );
      }),
      switchMap(communicationClient => {
        const baseEncodedCred = Buffer.from(
          communicationClient.clientId + ':' + communicationClient.clientSecret,
        ).toString('base64');
        const requestUrl =
          new URL(communicationClient.redirectUris[0]).origin +
          '/email/v1/system';
        const txtMessage =
          'Visit the following link to generate new password\n' +
          generateForgottenPasswordUrl;
        const htmlMessage = `To generate new password <a href='${generateForgottenPasswordUrl}'>click here</a>`;
        return this.http.post(
          requestUrl,
          {
            emailTo: user.email,
            subject: 'Forgot Password? Generate new password for ' + user.email,
            text: txtMessage,
            html: htmlMessage,
          },
          {
            headers: {
              authorization: 'Basic ' + baseEncodedCred,
            },
          },
        );
      }),
    );
  }
}
