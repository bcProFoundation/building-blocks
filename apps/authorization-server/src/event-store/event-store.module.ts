import { Module } from '@nestjs/common';
import { EventStoreSagas } from './sagas';
import { EventStoreCommandHandlers } from './commands';
import { EventStoreAggregates } from './aggregates';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  providers: [
    ...EventStoreAggregates,
    ...EventStoreSagas,
    ...EventStoreCommandHandlers,
  ],
})
export class EventStoreModule {}
