import { Module, HttpModule } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreController } from './controllers/event-store/event-store.controller';
import { EventStoreAggregates } from './aggregates';
import { EventStoreSagas } from './sagas';
import { EventStoreCommandHandlers } from './commands';
import { EventStoreQueryHandlers } from './queries';

@Module({
  imports: [HttpModule, CqrsModule],
  controllers: [EventStoreController],
  providers: [
    ...EventStoreAggregates,
    ...EventStoreSagas,
    ...EventStoreCommandHandlers,
    ...EventStoreQueryHandlers,
  ],
})
export class EventStoreModule {}
