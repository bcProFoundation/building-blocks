import { Module, HttpModule } from '@nestjs/common';
import { EventStoreSagas } from './sagas';
import { EventStoreCommandHandlers } from './commands';
import { EventStoreAggregates } from './aggregates';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [HttpModule, CqrsModule],
  providers: [
    ...EventStoreAggregates,
    ...EventStoreSagas,
    ...EventStoreCommandHandlers,
  ],
})
export class EventStoreModule {}
