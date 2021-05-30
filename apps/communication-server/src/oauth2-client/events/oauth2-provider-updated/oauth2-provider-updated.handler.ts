import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OAuth2ProviderUpdatedEvent } from './oauth2-provider-updated.event';

@EventsHandler(OAuth2ProviderUpdatedEvent)
export class OAuth2ProviderUpdatedHandler
  implements IEventHandler<OAuth2ProviderUpdatedEvent>
{
  handle(event: OAuth2ProviderUpdatedEvent) {
    const { provider } = event;
    provider
      .save()
      .then(success => {})
      .catch(error => {});
  }
}
