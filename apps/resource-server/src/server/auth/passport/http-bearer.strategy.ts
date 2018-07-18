import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { ClientService } from 'models/client/client.service';
import { AccountManager } from '../account.provider';
import { UserService } from 'models/user/user.service';
import { ConfigService } from 'config/config.service';
import { TOKEN_INACTIVE } from 'constants/messages';

@Injectable()
export class HttpBearerStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly accountManager: AccountManager,
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super();
  }
  async validate(token: any, done: (err?, user?, info?) => any) {
    const clientFixture = this.configService.getOAuth2Client();
    const client = await this.clientService.findOne({
      clientID: clientFixture.clientID,
    });
    const url = clientFixture.introspectionURL;
    const options: any = {
      headers: {
        Authorization: 'Bearer ' + client.accessToken,
      },
    };
    this.accountManager.post(url, { token }, options).subscribe({
      next: async response => {
        if (response.data.active && response.data.username) {
          const user = await this.userService.findOne({
            email: response.data.username,
          });
          done(null, user);
        } else done(null, false, { message: TOKEN_INACTIVE });
      },
      error: async error => {
        if (error.response.data.statusCode === 401) {
          const opts: any = {
            url,
            data: { token },
            options,
            callback: done,
          };
          await this.accountManager.getNewToken(opts);
        } else done(null, false, error.response.data.message);
      },
    });
  }
}
