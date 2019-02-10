import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { OAuth2ClientRemovedEvent } from './oauth2client-removed.event';

@EventsHandler(OAuth2ClientRemovedEvent)
export class OAuth2ClientRemovedHandler
  implements IEventHandler<OAuth2ClientRemovedEvent> {
  handle(event: OAuth2ClientRemovedEvent) {
    // inform
  }
}
