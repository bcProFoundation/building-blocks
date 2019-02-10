import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { OAuth2ScopeRemovedEvent } from './oauth2scope-removed.event';

@EventsHandler(OAuth2ScopeRemovedEvent)
export class OAuth2ScopeRemovedHandler
  implements IEventHandler<OAuth2ScopeRemovedEvent> {
  handle(event: OAuth2ScopeRemovedEvent) {
    // inform
  }
}
