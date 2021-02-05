import { Injectable, HttpService, BadRequestException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { handlebars } from 'hbs';
import { CommandBus } from '@nestjs/cqrs';
import { UserService } from '../../entities/user/user.service';
import { User } from '../../entities/user/user.interface';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { i18n } from '../../../i18n/i18n.config';
import { SignupViaPhoneDto } from '../../policies';
import { SignupViaPhoneCommand } from '../../commands/signup-via-phone/signup-via-phone.command';

@Injectable()
export class SignupService {
  constructor(
    private readonly http: HttpService,
    private readonly userService: UserService,
    private readonly serverSettingsService: ServerSettingsService,
    private readonly clientService: ClientService,
    private readonly commandBus: CommandBus,
  ) {}

  async initSignup(payload, res) {
    const unverifiedUser = {} as User;
    unverifiedUser.name = payload.name;
    unverifiedUser.email = payload.email;
    unverifiedUser.disabled = true;
    unverifiedUser.verificationCode = randomBytes(32).toString('hex');
    await this.userService.save(unverifiedUser);
    await this.emailRequest(unverifiedUser, res);
    return { message: res.__('Please check your email to complete signup') };
  }

  async initSignupViaPhone(payload: SignupViaPhoneDto) {
    return await this.commandBus.execute(new SignupViaPhoneCommand(payload));
  }

  async emailRequest(unverifiedUser: User, res) {
    // Send Email
    const settings = await this.serverSettingsService.find();

    const communicationClient = await this.clientService.findOne({
      clientId: settings.communicationServerClientId,
    });

    const requestUrl =
      new URL(communicationClient.redirectUris[0]).origin + '/email/v1/system';

    const verificationUrl =
      settings.issuerUrl + '/signup/' + unverifiedUser.verificationCode;

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
            res.__('Please complete sign up for ') + unverifiedUser.email,
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
          await this.userService.remove(unverifiedUser);
        },
      });
  }

  async validateSignupEnabled() {
    const settings = await this.serverSettingsService.find();
    if (settings.disableSignup) {
      throw new BadRequestException({
        message: i18n.__('Signup Disabled'),
      });
    }
  }

  getSignupHTML(template: string, verificationUrl: string) {
    const renderer = handlebars.compile(template);
    return renderer({ verificationUrl });
  }
}
