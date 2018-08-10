import { Injectable, HttpService } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { ClientService } from 'models/client/client.service';
import { AccountManager } from 'craft-account-manager';
import { UserService } from 'models/user/user.service';
import { ConfigService } from 'config/config.service';
import { TOKEN_INACTIVE } from 'constants/messages';

@Injectable()
export class HttpBearerStrategy extends PassportStrategy(Strategy) {
  accountManager: AccountManager;

  constructor(
    private readonly httpService: HttpService,
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.accountManager = new AccountManager(
      this.clientService,
      this.userService,
      this.httpService,
    );
  }
  async validate(token: any, done: (err?, user?, info?) => any) {
    const clientFixture = this.configService.getConfig('oauth2client');
    const client = await this.clientService.findOne({
      clientID: clientFixture.clientID,
    });
    const url = clientFixture.introspectionURL;
    const options: any = {
      headers: {
        Authorization: 'Bearer ' + client.accessToken,
      },
    };
    this.accountManager.introspectToken(
      url,
      token,
      options,
      TOKEN_INACTIVE,
      done,
    );
  }
}
