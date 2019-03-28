import { Module, Global } from '@nestjs/common';
import { ClientService } from './entities/client/client.service';
import { ScopeService } from './entities/scope/scope.service';
import { ClientController } from './controllers/client/client.controller';
import { ScopeController } from './controllers/scope/scope.controller';
import { ClientManagementEntitiesModule } from './entities/entities.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientManagementCommandHandlers } from './commands';
import { ClientManagementEventHandlers } from './events';
import { ClientManagementAggregateService } from './aggregates/client-management-aggregate/client-management-aggregate.service';

@Global()
@Module({
  providers: [
    ClientService,
    ScopeService,

    // CQRS
    ...ClientManagementCommandHandlers,
    ...ClientManagementEventHandlers,
    ClientManagementAggregateService,
  ],
  controllers: [ClientController, ScopeController],
  imports: [ClientManagementEntitiesModule, CqrsModule],
  exports: [ClientService, ScopeService, ClientManagementEntitiesModule],
})
export class ClientManagementModule {}
