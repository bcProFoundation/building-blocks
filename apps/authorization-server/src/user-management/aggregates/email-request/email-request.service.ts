import { Injectable, HttpService } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { handlebars } from 'hbs';
import { User } from '../../../user-management/entities/user/user.interface';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { AuthData } from '../../entities/auth-data/auth-data.interface';
import { i18n } from '../../../i18n/i18n.config';
import { UserService } from '../../entities/user/user.service';

@Injectable()
export class EmailRequestService {
  constructor(
    private readonly http: HttpService,
    private readonly settings: ServerSettingsService,
    private readonly client: ClientService,
    private readonly user: UserService,
    private readonly authData: UserService,
  ) {}

  emailForgottenPasswordVerificationCode(
    user: User,
    verificationCode: AuthData,
  ): Observable<unknown> {
    // Send Email
    let generateForgottenPasswordUrl: string;
    return from(this.settings.find()).pipe(
      switchMap(settings => {
        generateForgottenPasswordUrl =
          settings.issuerUrl + '/forgot/' + verificationCode.password;
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

  async emailRequest(unverifiedUser: User, verificationCode: AuthData) {
    // Send Email
    const settings = await this.settings.find();

    const communicationClient = await this.client.findOne({
      clientId: settings.communicationServerClientId,
    });

    const requestUrl =
      new URL(communicationClient.redirectUris[0]).origin + '/email/v1/system';

    const verificationUrl =
      settings.issuerUrl + '/signup/' + verificationCode.password;

    const txtMessage =
      'Visit the following link to complete signup\n' + verificationUrl;
    const htmlMessage = this.getSignupHTML(
      `To complete signup <a href='{{ verificationUrl }}'>click here</a>`,
      verificationUrl,
    );

    this.http
      .post(
        requestUrl,
        {
          emailTo: unverifiedUser.email,
          subject:
            i18n.__('Please complete sign up for ') + unverifiedUser.email,
          text: txtMessage,
          html: htmlMessage,
        },
        {
          auth: {
            username: communicationClient.clientId,
            password: communicationClient.clientSecret,
          },
        },
      )
      .subscribe({
        next: response => {
          return response;
        },
        error: async err => {
          await this.user.remove(unverifiedUser);
        },
      });
  }

  getSignupHTML(template: string, verificationUrl: string) {
    const renderer = handlebars.compile(template);
    return renderer({ verificationUrl });
  }

  async verifyEmail(email: AuthData, code: AuthData) {
    // Send Email
    const settings = await this.settings.find();

    const communicationClient = await this.client.findOne({
      clientId: settings.communicationServerClientId,
    });

    const requestUrl =
      new URL(communicationClient.redirectUris[0]).origin + '/email/v1/system';

    const verificationUrl = settings.issuerUrl + '/verify/' + code.password;

    const txtMessage =
      'Visit the following link to complete email verification\n' +
      verificationUrl;
    const htmlMessage = this.getSignupHTML(
      `To complete verification <a href='{{ verificationUrl }}'>click here</a>`,
      verificationUrl,
    );

    this.http
      .post(
        requestUrl,
        {
          emailTo: email.password,
          subject:
            i18n.__('Please complete verification for ') + email.password,
          text: txtMessage,
          html: htmlMessage,
        },
        {
          auth: {
            username: communicationClient.clientId,
            password: communicationClient.clientSecret,
          },
        },
      )
      .subscribe({
        next: response => {},
        error: async err => {
          await this.authData.remove(email);
          await this.authData.remove(code);
        },
      });
  }

  sendUnverifiedEmailVerificationCode(
    user: User,
    verificationCode: AuthData,
  ): Observable<unknown> {
    // Send Email
    let generateForgottenPasswordUrl: string;
    return from(this.settings.find()).pipe(
      switchMap(settings => {
        generateForgottenPasswordUrl =
          settings.issuerUrl + '/verify/' + verificationCode.password;
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
          'Visit the following link to verify email\n' +
          generateForgottenPasswordUrl;
        const htmlMessage = `To verify email <a href='${generateForgottenPasswordUrl}'>click here</a>`;
        return this.http.post(
          requestUrl,
          {
            emailTo: user.email,
            subject: 'Complete email verification for ' + user.email,
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
