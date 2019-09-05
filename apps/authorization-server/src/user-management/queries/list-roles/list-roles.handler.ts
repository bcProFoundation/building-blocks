import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ListRolesQuery } from './list-roles.query';
import { RoleService } from '../../entities/role/role.service';

@QueryHandler(ListRolesQuery)
export class ListRolesHandler implements IQueryHandler {
  constructor(private readonly role: RoleService) {}

  async execute(query: ListRolesQuery) {
    const { offset, limit, search, sort } = query;
    const where = {};
    const sortQuery = { name: sort };
    return await this.role.list(offset, limit, search, where, sortQuery);
  }
}
