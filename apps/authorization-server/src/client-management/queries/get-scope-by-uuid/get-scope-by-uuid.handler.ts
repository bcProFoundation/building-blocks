import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { GetScopeByUuidQuery } from './get-scope-by-uuid.query';
import { ScopeService } from '../../entities/scope/scope.service';

@QueryHandler(GetScopeByUuidQuery)
export class GetScopeByUuidHandler
  implements IQueryHandler<GetScopeByUuidQuery> {
  constructor(private readonly scope: ScopeService) {}

  async execute(query: GetScopeByUuidQuery) {
    const { uuid } = query;
    const client = await this.scope.findOne({ uuid });
    if (!client) throw new NotFoundException({ scopeUuid: uuid });
    return client;
  }
}
