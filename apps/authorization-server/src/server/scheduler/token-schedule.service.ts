import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { BearerTokenService } from '../models/bearer-token/bearer-token.service';
import * as Bull from 'bull';
import { BullOptions } from './bull-queue.options';
import { ConfigService } from '../config/config.service';

export const TOKEN_DELETE_QUEUE = 'token_delete';

@Injectable()
export class TokenSchedulerService implements OnModuleInit {
  protected queue: Bull.Queue;
  constructor(
    private readonly bearerTokenService: BearerTokenService,
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
          await token.remove();
        }
      }
      done(null, job.id);
    });
  }
  async addQueue() {
    await this.queue.add(
      TOKEN_DELETE_QUEUE,
      { message: TOKEN_DELETE_QUEUE },
      { repeat: { every: 3.6e6 } }, // every one hour in milliseconds
    );
  }
}
