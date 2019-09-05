import { Module, Global, HttpModule } from '@nestjs/common';
import { CryptographerService } from './services/cryptographer/cryptographer.service';
import { databaseProviders } from './database.provider';

@Global()
@Module({
  imports: [HttpModule],
  providers: [CryptographerService, ...databaseProviders],
  exports: [CryptographerService, ...databaseProviders, HttpModule],
})
export class CommonModule {}
