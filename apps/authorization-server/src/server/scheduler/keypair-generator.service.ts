import {
  Injectable,
  OnModuleInit,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import * as Bull from 'bull';
import { OIDCKeyService } from '../models/oidc-key/oidc-key.service';
import { BullOptions } from './bull-queue.options';
import { ConfigService } from '../config/config.service';
import { i18n } from '../i18n/i18n.config';

export const KEYGEN_QUEUE = 'keygen_queue';

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
  }

  async defineQueueProcess() {
    this.queue.process(KEYGEN_QUEUE, async (job, done) => {
      await this.keyService.generateKey();
      done(null, job.id);
    });
  }

  async generateKeyPair() {
    const countOfKeys = await this.keyService.count();
    if (countOfKeys === 0) {
      const { id, data } = await this.queue.add(KEYGEN_QUEUE, {
        message: KEYGEN_QUEUE,
      });
      return { id, data };
    } else {
      new HttpException(
        i18n.__('Setup already complete'),
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async getQueue(id: Bull.JobId) {
    return await this.queue.getJob(id);
  }

  async addQueue() {
    const { id, data } = await this.queue.add(KEYGEN_QUEUE, {
      message: 'generate_keypair',
    });
    return { id, data };
  }
}
