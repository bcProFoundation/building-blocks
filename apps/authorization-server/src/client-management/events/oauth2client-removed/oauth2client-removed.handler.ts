import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { OAuth2ClientRemovedEvent } from './oauth2client-removed.event';
import { from } from 'rxjs';
import { ClientService } from '../../entities/client/client.service';

@EventsHandler(OAuth2ClientRemovedEvent)
export class OAuth2ClientRemovedHandler
  implements IEventHandler<OAuth2ClientRemovedEvent> {
  constructor(private readonly client: ClientService) {}

  handle(event: OAuth2ClientRemovedEvent) {
    const { client } = event;
    from(this.client.deleteByClientId(client.clientId)).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
