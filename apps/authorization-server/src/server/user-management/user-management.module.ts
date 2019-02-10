import { Module, Global, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, EventBus, CQRSModule } from '@nestjs/cqrs';
import { UserManagementEntitiesModule } from './entities/entities.module';
import { UserManagementService } from './aggregates/user-management/user-management.service';
import { UserController } from './controllers/user/user.controller';
import { RoleController } from './controllers/role/role.controller';
import { UserDeleteRequestService } from './scheduler/user-delete-request.service';
import { UserAggregateService } from './aggregates/user-aggregate/user-aggregate.service';
import { UserManagementEventHandlers } from './events';
import { UserManagementCommandHandlers } from './commands';
import { UserManagementSagas } from './sagas';
import { EmailRequestService } from './aggregates/email-request/email-request.service';
import { SignupController } from './controllers/signup/signup.controller';

@Global()
@Module({
  imports: [UserManagementEntitiesModule, CQRSModule],
  providers: [
    UserManagementService,
    UserDeleteRequestService,
    UserAggregateService,

    // CQRS
    ...UserManagementEventHandlers,
    ...UserManagementCommandHandlers,
    ...UserManagementSagas,
    EmailRequestService,
  ],
  controllers: [UserController, RoleController, SignupController],
  exports: [
    UserManagementEntitiesModule,
    UserManagementService,
    UserAggregateService,
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
