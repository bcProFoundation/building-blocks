import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListServicesQuery } from './list-services.query';
import { ServiceService } from '../../entities/service/service.service';

@QueryHandler(ListServicesQuery)
export class ListServicesHandler implements IQueryHandler<ListServicesQuery> {
  constructor(private readonly service: ServiceService) {}

  async execute(query: ListServicesQuery) {
    const { offset, limit, search, sort } = query;
    let sortQuery = { name: 'ASC' };
    if (sort) sortQuery = { name: sort.toUpperCase() };
    return await this.service.paginate(offset, limit, search, sortQuery);
  }
}
