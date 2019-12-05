import { Module, Global } from '@nestjs/common';
import { EventStoreSagas } from './sagas';
import { EventStoreCommandHandlers } from './commands';
import { EventStoreAggregates } from './aggregates';
import { CqrsModule } from '@nestjs/cqrs';
import { EventServiceProvider } from './microservice/event-service.provider';

@Global()
@Module({
  imports: [CqrsModule],
  providers: [
    EventServiceProvider,
    ...EventStoreAggregates,
    ...EventStoreSagas,
    ...EventStoreCommandHandlers,
  ],
  exports: [EventServiceProvider, ...EventStoreAggregates],
})
export class EventStoreModule {}
