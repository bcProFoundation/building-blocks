import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import * as Bull from 'bull';
import { BullOptions } from '../../../constants/bull-queue.options';
import {
  ConfigService,
  BULL_QUEUE_REDIS_HOST,
  BULL_QUEUE_REDIS_PORT,
  BULL_QUEUE_REDIS_PASSWORD,
} from '../../../config/config.service';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';

export const AUTH_DATA_DELETE_QUEUE = 'auth_data_delete_queue';

@Injectable()
export class AuthDataScheduleService implements OnModuleInit {
  protected queue: Bull.Queue;
  constructor(
    private readonly authData: AuthDataService,
    private readonly configService: ConfigService,
  ) {
    const bullOptions: BullOptions = {
      redis: {
        host: this.configService.get(BULL_QUEUE_REDIS_HOST),
        port: Number(this.configService.get(BULL_QUEUE_REDIS_PORT)),
        password: this.configService.get(BULL_QUEUE_REDIS_PASSWORD),
      },
    };
    this.queue = new Bull(AUTH_DATA_DELETE_QUEUE, bullOptions);
  }

  async onModuleInit() {
    this.defineQueueProcess();
    await this.addQueue();
  }

  defineQueueProcess() {
    this.queue.process(AUTH_DATA_DELETE_QUEUE, async (job, done) => {
      const authDataCollection = await this.authData.find({
        expiry: { $lt: new Date() },
      });
      for (const authData of authDataCollection) {
        await this.authData.remove(authData);
      }
      done(null, job.id);
    });
  }

  async addQueue() {
    const every = 3.6e6; // every one hour in milliseconds
    await this.queue.add(
      AUTH_DATA_DELETE_QUEUE,
      { message: AUTH_DATA_DELETE_QUEUE },
      { repeat: { every } },
    );
  }
}
