import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import Agenda from 'agenda';
import { OIDCKeyService } from '../../entities/oidc-key/oidc-key.service';
import { AGENDA_CONNECTION } from '../../../common/database.provider';

export const KEYGEN_QUEUE = 'keygen_queue';
export const NUMBER_OF_KEYPAIRS = 2;
export const MONTH_IN_MILLISECONDS = 2.628e9;
export const FIFTEEN_DAYS_IN_MILLISECONDS = 1.296e9;

@Injectable()
export class KeyPairGeneratorService implements OnModuleInit {
  constructor(
    @Inject(AGENDA_CONNECTION)
    private readonly agenda: Agenda,
    private readonly keyService: OIDCKeyService,
  ) {}

  async onModuleInit() {
    await this.defineQueueProcess();
    await this.addQueue();
  }

  async defineQueueProcess() {
    this.agenda.define(KEYGEN_QUEUE, async job => {
      const keys = await this.keyService.find();
      if (keys.length === 0) {
        await this.keyService.generateKey();
      } else {
        for (const key of keys) {
          const now = new Date().getTime();
          const creation = new Date(key.creation).getTime();
          const timePastCreation = now - creation;

          if (timePastCreation > MONTH_IN_MILLISECONDS) {
            await this.keyService.remove(key);
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
    });
  }

  async generateKeyPair() {
    const countOfKeys = await this.keyService.count();
    if (countOfKeys === 0) {
      await this.agenda.now(KEYGEN_QUEUE);
    }
  }

  async addQueue() {
    const every = '1 day';
    await this.agenda.every(every, KEYGEN_QUEUE);
  }
}
