import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetServiceTypeByUuidQuery } from './get-service-type-by-uuid.query';
import { ServiceTypeService } from '../../entities/service-type/service-type.service';

@QueryHandler(GetServiceTypeByUuidQuery)
export class GetServiceTypeByUuidHandler
  implements IQueryHandler<GetServiceTypeByUuidQuery> {
  constructor(private readonly serviceType: ServiceTypeService) {}
  async execute(query: GetServiceTypeByUuidQuery) {
    const { uuid } = query;
    const serviceType = await this.serviceType.findOne({ uuid });
    return serviceType;
  }
}
