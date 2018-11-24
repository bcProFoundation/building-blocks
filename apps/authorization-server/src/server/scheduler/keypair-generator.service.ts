import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Bull from 'bull';
import { OIDCKeyService } from '../models/oidc-key/oidc-key.service';
import { BullOptions } from './bull-queue.options';
import { ConfigService } from '../config/config.service';

export const KEYGEN_QUEUE = 'keygen_queue';
export const NUMBER_OF_KEYPAIRS = 2;
export const MONTH_IN_MILLISECONDS = 2.628e9;
export const FIFTEEN_DAYS_IN_MILLISECONDS = 1.296e9;

@Injectable()
export class KeyPairGeneratorService implements OnModuleInit {
  protected queue: Bull.Queue;

  constructor(
    private readonly keyService: OIDCKeyService,
    private readonly configService: ConfigService,
  ) {
    const bullOptions: BullOptions = {
      redis: {
        host: this.configService.get('BULL_QUEUE_REDIS_HOST'),
        port: Number(this.configService.get('BULL_QUEUE_REDIS_PORT')),
      },
    };
    configService.get('BULL_QUEUE_REDIS_PORT');
    this.queue = new Bull(KEYGEN_QUEUE, bullOptions);
  }

  async onModuleInit() {
    await this.defineQueueProcess();
    await this.addQueue();
  }

  async defineQueueProcess() {
    this.queue.process(KEYGEN_QUEUE, async (job, done) => {
      const keys = await this.keyService.find();
      if (keys.length === 0) {
        await this.keyService.generateKey();
      } else {
        for (const key of keys) {
          const now = new Date().getTime();
          const creation = new Date(key.creation).getTime();
          const timePastCreation = now - creation;

          if (timePastCreation > MONTH_IN_MILLISECONDS) {
            await key.remove();
            await this.keyService.generateKey();
          } else if (
            // Keep NUMBER_OF_KEYPAIRS in array
            keys.length < NUMBER_OF_KEYPAIRS &&
            timePastCreation > FIFTEEN_DAYS_IN_MILLISECONDS
          ) {
            await this.keyService.generateKey();
          }
        }
      }
      done(null, job.id);
    });
  }

  async getQueue(id: Bull.JobId) {
    return await this.queue.getJob(id);
  }

  async addQueue() {
    const every = 8.64e7; // every day in milliseconds
    await this.queue.add(
      KEYGEN_QUEUE,
      {
        message: KEYGEN_QUEUE,
      },
      { repeat: { every } },
    );
  }
}
