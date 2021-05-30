import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTrustedClientsQuery } from './get-trusted-clients.query';
import { ClientService } from '../../entities/client/client.service';

@QueryHandler(GetTrustedClientsQuery)
export class GetTrustedClientsHandler
  implements IQueryHandler<GetTrustedClientsQuery>
{
  constructor(private readonly client: ClientService) {}

  async execute(query: GetTrustedClientsQuery) {
    return await this.client.find({ isTrusted: 1 });
  }
}
