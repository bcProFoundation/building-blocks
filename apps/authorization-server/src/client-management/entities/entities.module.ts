import { Module } from '@nestjs/common';
import { ClientService } from './client/client.service';
import { ScopeService } from './scope/scope.service';
import { ClientManagementModuleEntities } from './entities';

@Module({
  providers: [...ClientManagementModuleEntities, ClientService, ScopeService],
  exports: [...ClientManagementModuleEntities, ClientService, ScopeService],
})
export class ClientManagementEntitiesModule {}
