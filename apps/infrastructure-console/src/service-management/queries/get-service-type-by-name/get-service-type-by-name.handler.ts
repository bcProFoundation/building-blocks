import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetServiceTypeByNameQuery } from './get-service-type-by-name.query';
import { ServiceTypeService } from '../../entities/service-type/service-type.service';

@QueryHandler(GetServiceTypeByNameQuery)
export class GetServiceTypeByNameHandler
  implements IQueryHandler<GetServiceTypeByNameQuery>
{
  constructor(private readonly serviceType: ServiceTypeService) {}
  async execute(query: GetServiceTypeByNameQuery) {
    const { name } = query;
    return await this.serviceType.findOne({ name });
  }
}
