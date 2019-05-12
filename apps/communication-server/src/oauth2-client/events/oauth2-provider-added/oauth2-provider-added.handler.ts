import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OAuth2ProviderAddedEvent } from './oauth2-provider-added.event';

@EventsHandler(OAuth2ProviderAddedEvent)
export class OAuth2ProviderAddedHandler
  implements IEventHandler<OAuth2ProviderAddedEvent> {
  handle(event: OAuth2ProviderAddedEvent) {
    const { provider } = event;
    provider
      .save()
      .then(success => {})
      .catch(error => {});
  }
}
