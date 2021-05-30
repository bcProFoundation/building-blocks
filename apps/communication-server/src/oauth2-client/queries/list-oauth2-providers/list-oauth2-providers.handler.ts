import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ListOAuth2ProviderQuery } from './list-oauth2-providers.query';
import { Oauth2ProviderAggregateService } from '../../aggregates/oauth2-provider-aggregate/oauth2-provider-aggregate.service';

@QueryHandler(ListOAuth2ProviderQuery)
export class ListOAuth2ProviderHandler
  implements IQueryHandler<ListOAuth2ProviderQuery>
{
  constructor(private manager: Oauth2ProviderAggregateService) {}

  async execute(query: ListOAuth2ProviderQuery) {
    const { offset, limit, search, sort } = query;
    return await this.manager.list(offset, limit, search, sort);
  }
}
