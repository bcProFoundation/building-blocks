import { Injectable, HttpService } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { BearerTokenService } from '../../entities/bearer-token/bearer-token.service';
import * as Bull from 'bull';
import { BullOptions } from '../../../constants/bull-queue.options';
import {
  ConfigService,
  BULL_QUEUE_REDIS_HOST,
  BULL_QUEUE_REDIS_PORT,
  BULL_QUEUE_REDIS_PASSWORD,
} from '../../../config/config.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { retry } from 'rxjs/operators';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { THIRTY_NUMBER } from '../../../constants/app-strings';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.interface';

export const TOKEN_DELETE_QUEUE = 'token_delete';

@Injectable()
export class TokenSchedulerService implements OnModuleInit {
  protected queue: Bull.Queue;
  constructor(
    private readonly bearerTokenService: BearerTokenService,
    private readonly clientService: ClientService,
    private readonly http: HttpService,
    private readonly configService: ConfigService,
    private readonly settings: ServerSettingsService,
  ) {
    const bullOptions: BullOptions = {
      redis: {
        host: this.configService.get(BULL_QUEUE_REDIS_HOST),
        port: Number(this.configService.get(BULL_QUEUE_REDIS_PORT)),
        password: this.configService.get(BULL_QUEUE_REDIS_PASSWORD),
      },
    };
    this.queue = new Bull(TOKEN_DELETE_QUEUE, bullOptions);
  }

  async onModuleInit() {
    this.defineQueueProcess();
    await this.addQueue();
  }

  defineQueueProcess() {
    this.queue.process(TOKEN_DELETE_QUEUE, async (job, done) => {
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
      done(null, job.id);
    });
  }
  async addQueue() {
    const every = 3.6e6; // every one hour in milliseconds
    await this.queue.add(
      TOKEN_DELETE_QUEUE,
      { message: TOKEN_DELETE_QUEUE },
      { repeat: { every } },
    );
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
