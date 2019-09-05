import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { RetrieveRolesQuery } from './retrieve-role.query';
import { RoleService } from '../../entities/role/role.service';

@QueryHandler(RetrieveRolesQuery)
export class RetrieveRolesHandler implements IQueryHandler {
  constructor(private readonly role: RoleService) {}

  async execute(query: RetrieveRolesQuery) {
    const { uuid } = query;
    const role = await this.role.findOne({ uuid });
    if (!role) new NotFoundException({ uuid });
    return role;
  }
}
