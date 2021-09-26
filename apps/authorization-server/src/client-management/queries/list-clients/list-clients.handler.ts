import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListClientsQuery } from './list-clients.query';
import { UserService } from '../../../user-management/entities/user/user.service';
import { ClientService } from '../../entities/client/client.service';

@QueryHandler(ListClientsQuery)
export class ListClientsHandler implements IQueryHandler<ListClientsQuery> {
  constructor(
    private readonly user: UserService,
    private readonly client: ClientService,
  ) {}

  async execute(query: ListClientsQuery) {
    const { userUuid, offset, limit, search, sort } = query;
    const where: { createdBy?: string } = {};

    if (!(await this.user.checkAdministrator(userUuid))) {
      where.createdBy = userUuid;
    }

    const sortQuery = { name: sort };
    return await this.client.list(search, where, sortQuery, offset, limit);
  }
}
