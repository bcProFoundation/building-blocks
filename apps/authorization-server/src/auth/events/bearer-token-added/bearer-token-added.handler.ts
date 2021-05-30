import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { BearerTokenAddedEvent } from './bearer-token-added.event';
import { BearerTokenService } from '../../entities/bearer-token/bearer-token.service';

@EventsHandler(BearerTokenAddedEvent)
export class BearerTokenAddedHandler
  implements IEventHandler<BearerTokenAddedEvent>
{
  constructor(private readonly token: BearerTokenService) {}
  handle(event: BearerTokenAddedEvent) {
    const { token } = event;
    this.token.save(token).catch(error => {});
  }
}
