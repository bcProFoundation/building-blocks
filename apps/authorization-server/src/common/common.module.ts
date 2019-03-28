import { Module, Global } from '@nestjs/common';
import { CryptographerService } from './cryptographer.service';
import { CRUDOperationService } from './services/crudoperation/crudoperation.service';

@Global()
@Module({
  providers: [CryptographerService, CRUDOperationService],
  exports: [CryptographerService, CRUDOperationService],
})
export class CommonModule {}
