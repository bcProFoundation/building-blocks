import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { RetrieveOAuth2ProviderQuery } from './retrieve-oauth2-provider.query';
import { Oauth2ProviderAggregateService } from '../../aggregates/oauth2-provider-aggregate/oauth2-provider-aggregate.service';

@QueryHandler(RetrieveOAuth2ProviderQuery)
export class RetrieveOAuth2ProviderHandler
  implements IQueryHandler<RetrieveOAuth2ProviderQuery> {
  constructor(private manager: Oauth2ProviderAggregateService) {}

  async execute(query: RetrieveOAuth2ProviderQuery) {
    const { uuid } = query;
    return await this.manager.retrieveProvider(uuid);
  }
}
