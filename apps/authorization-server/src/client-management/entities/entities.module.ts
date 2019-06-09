import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientService } from './client/client.service';
import { ScopeService } from './scope/scope.service';
import { ClientManagementModuleEntities } from './entities';

@Module({
  imports: [MongooseModule.forFeature(ClientManagementModuleEntities)],
  providers: [ClientService, ScopeService],
  exports: [
    ClientService,
    ScopeService,
    MongooseModule.forFeature(ClientManagementModuleEntities),
  ],
})
export class ClientManagementEntitiesModule {}
