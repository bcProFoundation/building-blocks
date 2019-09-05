import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClientByUuidQuery } from './get-client-by-uuid.query';
import { UserService } from '../../../user-management/entities/user/user.service';
import { ClientService } from '../../entities/client/client.service';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetClientByUuidQuery)
export class GetClientByUuidHandler
  implements IQueryHandler<GetClientByUuidQuery> {
  constructor(
    private readonly user: UserService,
    private readonly client: ClientService,
  ) {}

  async execute(query: GetClientByUuidQuery) {
    const { clientUuid, userUuid } = query;
    let client;
    if (await this.user.checkAdministrator(userUuid)) {
      client = await this.client.findOne({ uuid: clientUuid });
    } else {
      client = await this.client.findOne({
        uuid: clientUuid,
        createdBy: userUuid,
      });
    }
    if (!client) throw new NotFoundException({ clientUuid });
    return client;
  }
}
