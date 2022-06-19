import { Injectable, OnModuleInit } from '@nestjs/common';
import cron from 'node-cron';
import { OIDCKeyService } from '../../entities/oidc-key/oidc-key.service';

export const NUMBER_OF_KEYPAIRS = 2;
export const MONTH_IN_MILLISECONDS = 2.628e9;
export const FIFTEEN_DAYS_IN_MILLISECONDS = 1.296e9;

@Injectable()
export class KeyPairGeneratorService implements OnModuleInit {
  constructor(private readonly keyService: OIDCKeyService) {}

  onModuleInit() {
    // Every day
    cron.schedule('0 0 * * *', async () => await this.generateKeyPair());
  }

  async generateKeyPair() {
    const keys = await this.keyService.find();
    if (keys.length === 0) {
      // Generate key pair if not found
      await this.keyService.generateKey();
    } else {
      // Generate new key pair every 15 days
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
  }
}
