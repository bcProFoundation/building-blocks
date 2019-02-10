import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, CLIENT } from './client/client.schema';
import { ClientService } from './client/client.service';
import { SCOPE, Scope } from './scope/scope.schema';
import { ScopeService } from './scope/scope.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CLIENT, schema: Client },
      { name: SCOPE, schema: Scope },
    ]),
  ],
  providers: [ClientService, ScopeService],
  exports: [ClientService, ScopeService],
})
export class ClientManagementEntitiesModule {}
