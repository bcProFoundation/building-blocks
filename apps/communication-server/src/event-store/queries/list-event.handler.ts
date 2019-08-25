import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ListEventsQuery } from './list-event.query';
import { EventStoreAggregateService } from '../aggregates/event-store-aggregate/event-store-aggregate.service';
import { ReadDirection } from 'geteventstore-promise';

@QueryHandler(ListEventsQuery)
export class ListEventsHandler implements IQueryHandler<ListEventsQuery> {
  constructor(private readonly manager: EventStoreAggregateService) {}

  async execute({ query }: ListEventsQuery) {
    return await this.manager.list(
      query.page,
      Number(query.length),
      query.direction as ReadDirection,
      query.type,
      query.stream,
    );
  }
}
