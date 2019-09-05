import { Module, Global, HttpModule } from '@nestjs/common';
import { CryptographerService } from './services/cryptographer/cryptographer.service';
import { databaseProviders } from './database.provider';
import { CRUDOperationService } from './services/crudoperation/crudoperation.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [CRUDOperationService, CryptographerService, ...databaseProviders],
  exports: [
    CRUDOperationService,
    CryptographerService,
    ...databaseProviders,
    HttpModule,
  ],
})
export class CommonModule {}
