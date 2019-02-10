import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SocialLoginRemovedEvent } from './social-login-removed.event';

@EventsHandler(SocialLoginRemovedEvent)
export class SocialLoginRemovedHandler
  implements IEventHandler<SocialLoginRemovedEvent> {
  handle(event: SocialLoginRemovedEvent) {
    // broadcast
  }
}
