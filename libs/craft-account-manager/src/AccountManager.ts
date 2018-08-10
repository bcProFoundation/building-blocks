import { HttpService } from '@nestjs/common';
import { AbstractClientService } from './interfaces/AbstractClientService';
import { AbstractUserService } from './interfaces/AbstractUserService';
import { IntrospectTokenOptions } from './interfaces/IntrospectTokenOptions';

export class AccountManager {
  constructor(
    private readonly clientService: AbstractClientService,
    private readonly userService: AbstractUserService,
    private readonly httpService: HttpService,
  ) {}

  async introspectToken(
    url: string,
    token: string,
    options: any,
    TOKEN_INACTIVE: string,
    done: (err?, user?, info?) => any,
  ) {
    this.httpService.post(url, { token }, options).subscribe({
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
          await this.getNewToken(opts);
        } else done(null, false, error.response.data.message);
      },
    });
  }

  async getNewToken(opts?: IntrospectTokenOptions) {
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
        next: async response => {
          client.accessToken = response.data.access_token;
          client.refreshToken = response.data.refresh_token;
          token = response.data.access_token;
          client.save();
        },
        error: error => {
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
                next: async response => {
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
}
