import { Injectable } from '@nestjs/common';
import * as Bull from 'bull';
import { BullOptions } from '../../../constants/bull-queue.options';
import { ConfigService } from '../../../config/config.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { AuthorizationCodeService } from '../../entities/authorization-code/authorization-code.service';
import { ServerSettings } from '../../../system-settings/entities/server-settings/server-settings.interface';
import { TEN_NUMBER } from '../../../constants/app-strings';

export const AUTH_CODE_DELETE_QUEUE = 'auth_code_delete_queue';

@Injectable()
export class AuthCodeSchedulerService {
  protected queue: Bull.Queue;

  constructor(
    private readonly config: ConfigService,
    private readonly settings: ServerSettingsService,
    private readonly authCode: AuthorizationCodeService,
  ) {
    const bullOptions: BullOptions = {
      redis: {
        host: this.config.get('BULL_QUEUE_REDIS_HOST'),
        port: Number(this.config.get('BULL_QUEUE_REDIS_PORT')),
        password: this.config.get('BULL_QUEUE_REDIS_PASSWORD'),
      },
    };
    this.queue = new Bull(AUTH_CODE_DELETE_QUEUE, bullOptions);
  }

  async onModuleInit() {
    this.defineQueueProcess();
    await this.addQueue();
  }

  defineQueueProcess() {
    this.queue.process(AUTH_CODE_DELETE_QUEUE, async (job, done) => {
      const authCodes = await this.authCode.find({});

      let settings = {
        authCodeExpiresInMinutes: TEN_NUMBER,
      } as ServerSettings;

      try {
        settings = await this.settings.find();
      } catch (error) {}

      for (const code of authCodes) {
        const expiry = code.creation;
        expiry.setMinutes(
          expiry.getMinutes() + settings.authCodeExpiresInMinutes,
        );

        if (new Date() > expiry) {
          await code.remove();
        }
      }
      done(null, job.id);
    });
  }

  async addQueue() {
    const every = 900000; // every one 15 min in milliseconds
    await this.queue.add(
      AUTH_CODE_DELETE_QUEUE,
      { message: AUTH_CODE_DELETE_QUEUE },
      { repeat: { every } },
    );
  }
}
