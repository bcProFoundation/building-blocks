import { Module, Global, HttpModule } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreController } from './controllers/event-store/event-store.controller';
import { EventStoreAggregates } from './aggregates';
import { EventStoreSagas } from './sagas';
import { EventStoreCommandHandlers } from './commands';
import { EventStoreQueryHandlers } from './queries';
import { EventServiceProvider } from './microservice/event-service.provider';

@Global()
@Module({
  imports: [HttpModule, CqrsModule],
  controllers: [EventStoreController],
  providers: [
    EventServiceProvider,
    ...EventStoreAggregates,
    ...EventStoreSagas,
    ...EventStoreCommandHandlers,
    ...EventStoreQueryHandlers,
  ],
  exports: [EventServiceProvider, ...EventStoreAggregates],
})
export class EventStoreModule {}
