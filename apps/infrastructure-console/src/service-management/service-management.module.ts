import { Module, HttpModule } from '@nestjs/common';
import { ServiceManagementControllers } from './controllers';
import { ServiceManagementAggregates } from './aggregates';
import { CqrsModule } from '@nestjs/cqrs';
import { ServiceManagementEntitiesModule } from './entities/entities.module';
import { ServiceManagementQueries } from './queries';
import { ServiceManagementCommands } from './commands';
import { ServiceManagementEvents } from './events';
import { ServiceManagementPolicies } from './policies';

@Module({
  imports: [CqrsModule, ServiceManagementEntitiesModule, HttpModule],
  controllers: [...ServiceManagementControllers],
  providers: [
    ...ServiceManagementAggregates,
    ...ServiceManagementQueries,
    ...ServiceManagementCommands,
    ...ServiceManagementEvents,
    ...ServiceManagementPolicies,
  ],
  exports: [...ServiceManagementAggregates, ServiceManagementEntitiesModule],
})
export class ServiceManagementModule {}
