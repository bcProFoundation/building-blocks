import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BearerTokensDeletedEvent } from './bearer-tokens-deleted.event';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';

@EventsHandler(BearerTokensDeletedEvent)
export class BearerTokensDeletedHandler
  implements IEventHandler<BearerTokensDeletedEvent> {
  constructor(private readonly bearerToken: BearerTokenService) {}

  handle(event: BearerTokensDeletedEvent) {
    this.bearerToken
      .clear()
      .then(success => {})
      .catch(error => {});
  }
}
