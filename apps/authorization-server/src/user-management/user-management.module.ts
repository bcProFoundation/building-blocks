import { Module, Global } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
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
    CqrsModule,
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
export class UserManagementModule {}
