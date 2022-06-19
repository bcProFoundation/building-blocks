import { Module, Global } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserManagementEntitiesModule } from './entities/entities.module';
import { UserManagementEventHandlers } from './events';
import { UserManagementCommandHandlers } from './commands';
import { UserManagementSagas } from './sagas';
import { UserManagementAggregates } from './aggregates';
import { UserManagementControllers } from './controllers';
import { UserManagementPolicies } from './policies';
import { UserManagementQueryHandlers } from './queries';

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
    ...UserManagementPolicies,
    ...UserManagementQueryHandlers,
  ],
  controllers: [...UserManagementControllers],
  exports: [
    UserManagementEntitiesModule,
    ...UserManagementAggregates,
    ...UserManagementPolicies,
  ],
})
export class UserManagementModule {}
