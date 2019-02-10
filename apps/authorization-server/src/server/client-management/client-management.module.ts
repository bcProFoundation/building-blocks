import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ClientService } from './entities/client/client.service';
import { ScopeService } from './entities/scope/scope.service';
import { ClientController } from './controllers/client/client.controller';
import { ScopeController } from './controllers/scope/scope.controller';
import { ClientManagementEntitiesModule } from './entities/entities.module';
import { CommandBus, EventBus, CQRSModule } from '@nestjs/cqrs';
import { ModuleRef } from '@nestjs/core';
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
  imports: [ClientManagementEntitiesModule, CQRSModule],
  exports: [ClientService, ScopeService, ClientManagementEntitiesModule],
})
export class ClientManagementModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}

  onModuleInit() {
    this.commandBus.setModuleRef(this.moduleRef);
    this.eventBus.setModuleRef(this.moduleRef);
    this.commandBus.register(ClientManagementCommandHandlers);
    this.eventBus.register(ClientManagementEventHandlers);
  }
}
