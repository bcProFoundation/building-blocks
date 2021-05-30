import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetServiceByClientIdQuery } from './get-service-by-clientid.query';
import { ServiceService } from '../../entities/service/service.service';

@QueryHandler(GetServiceByClientIdQuery)
export class GetServiceByClientIdHandler
  implements IQueryHandler<GetServiceByClientIdQuery>
{
  constructor(private readonly service: ServiceService) {}
  async execute(query: GetServiceByClientIdQuery) {
    const { clientId } = query;
    return await this.service.findOne({ clientId });
  }
}
