import { IQuery } from '@nestjs/cqrs';
import { EventListQueryDto } from '../controllers/event-store/list-query-dto';

export class ListEventsQuery implements IQuery {
  constructor(public readonly query: EventListQueryDto) {}
}
