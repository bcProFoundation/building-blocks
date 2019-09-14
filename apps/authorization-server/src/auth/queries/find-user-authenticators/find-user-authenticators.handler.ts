import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserAuthenticatorsQuery } from './find-user-authenticators.query';
import { WebAuthnAggregateService } from '../../aggregates/webauthn-aggregate/webauthn-aggregate.service';

@QueryHandler(FindUserAuthenticatorsQuery)
export class FindUserAuthenticatorsHandler
  implements IQueryHandler<FindUserAuthenticatorsQuery> {
  constructor(private readonly aggregate: WebAuthnAggregateService) {}

  async execute(query: FindUserAuthenticatorsQuery) {
    const { actorUuid, userUuid } = query;
    return await this.aggregate.find(actorUuid, userUuid);
  }
}
