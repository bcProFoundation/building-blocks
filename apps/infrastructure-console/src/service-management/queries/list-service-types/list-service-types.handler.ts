import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListServiceTypesQuery } from './list-service-types.query';
import { ServiceTypeService } from '../../entities/service-type/service-type.service';

@QueryHandler(ListServiceTypesQuery)
export class ListServiceTypesHandler
  implements IQueryHandler<ListServiceTypesQuery>
{
  constructor(private readonly serviceType: ServiceTypeService) {}

  async execute(query: ListServiceTypesQuery) {
    const { offset, limit, search, sort } = query;
    let sortQuery = { name: 'ASC' };
    if (sort) sortQuery = { name: sort.toUpperCase() };
    return await this.serviceType.paginate(offset, limit, search, sortQuery);
  }
}
