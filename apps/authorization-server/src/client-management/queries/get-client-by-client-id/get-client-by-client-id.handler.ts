import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClientByClientIdQuery } from './get-client-by-client-id.query';
import { UserService } from '../../../user-management/entities/user/user.service';
import { ClientService } from '../../entities/client/client.service';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetClientByClientIdQuery)
export class GetClientByClientIdHandler
  implements IQueryHandler<GetClientByClientIdQuery>
{
  constructor(
    private readonly user: UserService,
    private readonly client: ClientService,
  ) {}

  async execute(query: GetClientByClientIdQuery) {
    const { clientId, userUuid } = query;
    let client;
    if (await this.user.checkAdministrator(userUuid)) {
      client = await this.client.findOne({ clientId });
    } else {
      client = await this.client.findOne({
        clientId,
        createdBy: userUuid,
      });
    }
    if (!client) throw new NotFoundException({ clientId });
    return client;
  }
}
