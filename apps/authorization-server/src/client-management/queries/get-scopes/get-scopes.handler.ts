import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetScopesQuery } from './get-scopes.query';
import { ScopeService } from '../../entities/scope/scope.service';

@QueryHandler(GetScopesQuery)
export class GetScopesHandler implements IQueryHandler<GetScopesQuery> {
  constructor(private readonly scope: ScopeService) {}

  async execute(query: GetScopesQuery) {
    return await this.scope.find({});
  }
}
