import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { OAuth2ClientRemovedEvent } from './oauth2client-removed.event';
import { from } from 'rxjs';

@EventsHandler(OAuth2ClientRemovedEvent)
export class OAuth2ClientRemovedHandler
  implements IEventHandler<OAuth2ClientRemovedEvent> {
  handle(event: OAuth2ClientRemovedEvent) {
    const { client } = event;
    from(client.remove()).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
