import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, EventBus, CQRSModule } from '@nestjs/cqrs';
import { UserManagementEntitiesModule } from './entities/entities.module';
import { UserManagementEventHandlers } from './events';
import { UserManagementCommandHandlers } from './commands';
import { UserManagementSagas } from './sagas';
import { UserManagementAggregates } from './aggregates';
import { UserManagementControllers } from './controllers';
import { UserManagementSchedulers } from './schedulers';
import { UserManagementPolicies } from './policies';

@Global()
@Module({
  imports: [
    CQRSModule,
    // Entities
    UserManagementEntitiesModule,
  ],
  providers: [
    ...UserManagementAggregates,
    ...UserManagementCommandHandlers,
    ...UserManagementEventHandlers,
    ...UserManagementSagas,
    ...UserManagementSchedulers,
    ...UserManagementPolicies,
  ],
  controllers: [...UserManagementControllers],
  exports: [
    UserManagementEntitiesModule,
    ...UserManagementAggregates,
    ...UserManagementSchedulers,
    ...UserManagementPolicies,
  ],
})
export class UserManagementModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly commandBus: CommandBus,
    private readonly eventsBus: EventBus,
  ) {}

  onModuleInit() {
    this.eventsBus.setModuleRef(this.moduleRef);
    this.commandBus.setModuleRef(this.moduleRef);

    this.eventsBus.register(UserManagementEventHandlers);
    this.commandBus.register(UserManagementCommandHandlers);
  }
}
