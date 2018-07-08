import { Module } from '@nestjs/common';
import { CryptographerService } from './cryptographer.service';

@Module({
  providers: [CryptographerService],
  exports: [CryptographerService],
})
export class UtilitiesModule {}
