import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetRolesQuery } from './get-roles.query';
import { RoleService } from '../../entities/role/role.service';

@QueryHandler(GetRolesQuery)
export class GetRolesHandler implements IQueryHandler {
  constructor(private readonly role: RoleService) {}

  async execute(query: GetRolesQuery) {
    return await this.role.find();
  }
}
