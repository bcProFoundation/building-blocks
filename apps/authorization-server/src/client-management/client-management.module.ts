import { Module, Global } from '@nestjs/common';
import { ClientService } from './entities/client/client.service';
import { ScopeService } from './entities/scope/scope.service';
import { ClientController } from './controllers/client/client.controller';
import { ScopeController } from './controllers/scope/scope.controller';
import { ClientManagementEntitiesModule } from './entities/entities.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientManagementCommandHandlers } from './commands';
import { ClientManagementEventHandlers } from './events';
import { ClientManagementPolicies } from './policies';
import { ClientManagementAggregates } from './aggregates';

@Global()
@Module({
  providers: [
    ClientService,
    ScopeService,

    // CQRS
    ...ClientManagementCommandHandlers,
    ...ClientManagementEventHandlers,
    ...ClientManagementAggregates,
    ...ClientManagementPolicies,
  ],
  controllers: [ClientController, ScopeController],
  imports: [ClientManagementEntitiesModule, CqrsModule],
  exports: [ClientService, ScopeService, ClientManagementEntitiesModule],
})
export class ClientManagementModule {}
