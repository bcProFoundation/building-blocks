import { Injectable, HttpService, Inject } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { retry } from 'rxjs/operators';
import * as Agenda from 'agenda';
import { BearerTokenService } from '../../entities/bearer-token/bearer-token.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { THIRTY_NUMBER } from '../../../constants/app-strings';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.interface';
import { AGENDA_CONNECTION } from '../../../common/database.provider';

export const TOKEN_DELETE_QUEUE = 'token_delete';

@Injectable()
export class TokenSchedulerService implements OnModuleInit {
  constructor(
    @Inject(AGENDA_CONNECTION)
    private readonly agenda: Agenda,
    private readonly bearerTokenService: BearerTokenService,
    private readonly clientService: ClientService,
    private readonly http: HttpService,
    private readonly settings: ServerSettingsService,
  ) {}

  async onModuleInit() {
    this.defineQueueProcess();
    await this.addQueue();
  }

  defineQueueProcess() {
    this.agenda.define(TOKEN_DELETE_QUEUE, async job => {
      const tokens = await this.bearerTokenService.getAll();
      let settings = {
        refreshTokenExpiresInDays: THIRTY_NUMBER,
      } as ServerSettings;
      try {
        settings = await this.settings.find();
      } catch (error) {}

      for (const token of tokens) {
        const accessToken = token.accessToken;
        const now = new Date();
        const exp = new Date(token.creation.getTime() + token.expiresIn * 1000);
        const refreshTokenExp = new Date(token.creation.getTime());
        refreshTokenExp.setDate(
          refreshTokenExp.getDate() + settings.refreshTokenExpiresInDays,
        );
        if (exp.valueOf() < now.valueOf() && !token.refreshToken) {
          await this.bearerTokenService.remove(token);
          await this.informClients(accessToken);
        } else if (
          token.refreshToken &&
          refreshTokenExp.valueOf() < now.valueOf()
        ) {
          await this.bearerTokenService.remove(token);
          await this.informClients(accessToken);
        }
      }
    });
  }
  async addQueue() {
    const every = '1 hour'; // every one hour in milliseconds
    await this.agenda.every(every, TOKEN_DELETE_QUEUE);
  }

  async informClients(accessToken: string) {
    const clients = await this.clientService.findAll();
    for (const client of clients) {
      if (client.tokenDeleteEndpoint) {
        this.http
          .post(
            client.tokenDeleteEndpoint,
            {
              message: TOKEN_DELETE_QUEUE,
              accessToken,
            },
            {
              auth: {
                username: client.clientId,
                password: client.clientSecret,
              },
            },
          )
          .pipe(retry(3))
          .subscribe({
            error: error => {
              // TODO: Log Error
            },
          });
      }
    }
  }
}
