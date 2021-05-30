import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetServiceByUuidQuery } from './get-service-by-uuid.query';
import { ServiceService } from '../../entities/service/service.service';

@QueryHandler(GetServiceByUuidQuery)
export class GetServiceByUuidHandler
  implements IQueryHandler<GetServiceByUuidQuery>
{
  constructor(private readonly service: ServiceService) {}
  async execute(query: GetServiceByUuidQuery) {
    const { uuid } = query;
    return await this.service.findOne({ uuid });
  }
}
