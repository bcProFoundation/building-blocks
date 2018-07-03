import {
  Injectable,
  NotFoundException,
  HttpService,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientService } from 'models/client/client.service';
import { UserService } from 'models/user/user.service';

@Injectable()
export class AccountManager implements OnModuleInit {
  onModuleInit() {
    this.setupClient();
  }

  constructor(
    private readonly clientService: ClientService,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
  ) {}

  async setupClient() {
    let client;
    const clients = await this.clientService.find();
    if (clients.length) client = clients[0];
    else throw new NotFoundException();
    if (client && (!client.accessToken || !client.refreshToken)) {
      await this.getNewToken();
    }
  }

  async getNewToken(opts?) {
    let client, token;
    const clients = await this.clientService.find();
    if (clients.length) client = clients[0];
    this.httpService
      .post(client.tokenURL, {
        client_id: client.clientID,
        client_secret: client.clientSecret,
        grant_type: 'client_credentials',
      })
      .subscribe({
        next: async (response) => {
          client.accessToken = response.data.access_token;
          client.refreshToken = response.data.refresh_token;
          token = response.data.access_token;
          client.save();
        },
        error: (error) => {
          if (opts) opts.callback(error);
        },
        complete: async () => {
          if (opts) {
            this.httpService
              .post(opts.url, opts.data, {
                headers: {
                  Authorization: 'Bearer ' + token,
                },
              })
              .subscribe({
                next: async (response) => {
                  if (response.data.active) {
                    const user = await this.userService.findOne({
                      email: response.data.username,
                    });
                    opts.callback(null, user);
                  }
                },
              });
          }
        },
      });
  }

  async getUserToken(email) {
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new NotFoundException();
    }

    return {
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    };
  }

  post(url, data, options?) {
    return this.httpService.post(url, data, options);
  }
}
