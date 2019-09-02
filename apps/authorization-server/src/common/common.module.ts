import { Module, Global } from '@nestjs/common';
import { CryptographerService } from './services/cryptographer/cryptographer.service';
import { CRUDOperationService } from './services/crudoperation/crudoperation.service';
import { databaseProviders } from './database.provider';

@Global()
@Module({
  providers: [CryptographerService, CRUDOperationService, ...databaseProviders],
  exports: [CryptographerService, CRUDOperationService, ...databaseProviders],
})
export class CommonModule {}
