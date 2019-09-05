import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListScopesQuery } from './list-scopes.query';
import { ScopeService } from '../../entities/scope/scope.service';

@QueryHandler(ListScopesQuery)
export class ListScopesHandler implements IQueryHandler<ListScopesQuery> {
  constructor(private readonly scope: ScopeService) {}

  async execute(query: ListScopesQuery) {
    const { offset, limit, search, sort } = query;
    const where = {};
    const sortQuery = { name: sort };
    return await this.scope.list(offset, limit, search, where, sortQuery);
  }
}
