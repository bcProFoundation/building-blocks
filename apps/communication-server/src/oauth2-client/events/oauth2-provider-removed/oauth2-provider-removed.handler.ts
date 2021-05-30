import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OAuth2ProviderRemovedEvent } from './oauth2-provider-removed.event';

@EventsHandler(OAuth2ProviderRemovedEvent)
export class OAuth2ProviderRemovedHandler
  implements IEventHandler<OAuth2ProviderRemovedEvent>
{
  handle(event: OAuth2ProviderRemovedEvent) {
    const { provider } = event;
    provider
      .remove()
      .then(success => {})
      .catch(error => {});
  }
}
