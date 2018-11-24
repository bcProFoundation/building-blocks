import { Injectable, HttpService } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { BearerTokenService } from '../models/bearer-token/bearer-token.service';
import * as Bull from 'bull';
import { BullOptions } from './bull-queue.options';
import { ConfigService } from '../config/config.service';
import { ClientService } from '../models/client/client.service';
import { retry } from 'rxjs/operators';

export const TOKEN_DELETE_QUEUE = 'token_delete';

@Injectable()
export class TokenSchedulerService implements OnModuleInit {
  protected queue: Bull.Queue;
  constructor(
    private readonly bearerTokenService: BearerTokenService,
    private readonly clientService: ClientService,
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {
    const bullOptions: BullOptions = {
      redis: {
        host: this.configService.get('BULL_QUEUE_REDIS_HOST'),
        port: Number(this.configService.get('BULL_QUEUE_REDIS_PORT')),
      },
    };
    configService.get('BULL_QUEUE_REDIS_PORT');
    this.queue = new Bull(TOKEN_DELETE_QUEUE, bullOptions);
  }

  async onModuleInit() {
    this.defineQueueProcess();
    await this.addQueue();
  }

  defineQueueProcess() {
    this.queue.process(TOKEN_DELETE_QUEUE, async (job, done) => {
      const tokens = await this.bearerTokenService.getAll();
      for (const token of tokens) {
        const exp = new Date(token.creation.getTime() + token.expiresIn * 1000);
        if (exp.valueOf() < new Date().valueOf() && !token.refreshToken) {
          const accessToken = token.accessToken;
          await token.remove();
          const clientModel = this.clientService.getModel();
          const clients = await clientModel.find().exec();
          for (const client of clients) {
            if (client.tokenDeleteEndpoint) {
              const baseEncodedCred = Buffer.from(
                client.clientId + ':' + client.clientSecret,
              ).toString('base64');
              this.http
                .post(
                  client.tokenDeleteEndpoint,
                  {
                    message: TOKEN_DELETE_QUEUE,
                    accessToken,
                  },
                  {
                    headers: {
                      Authorization: 'Basic ' + baseEncodedCred,
                    },
                  },
                )
                .pipe(retry(3))
                .subscribe();
            }
          }
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
}
