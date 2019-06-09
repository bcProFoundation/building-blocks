import { Module, Global, HttpModule } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserManagementEntitiesModule } from './entities/entities.module';
import { UserManagementEventHandlers } from './events';
import { UserManagementCommandHandlers } from './commands';
import { UserManagementSagas } from './sagas';
import { UserManagementAggregates } from './aggregates';
import { UserManagementControllers } from './controllers';
import { UserManagementSchedulers } from './schedulers';
import { UserManagementPolicies } from './policies';
import { UserManagementQueryHandlers } from './queries';

@Global()
@Module({
  imports: [
    CqrsModule,
    HttpModule,
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
    ...UserManagementQueryHandlers,
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
