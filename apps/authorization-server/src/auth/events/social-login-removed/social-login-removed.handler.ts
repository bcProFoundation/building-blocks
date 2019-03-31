import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SocialLoginRemovedEvent } from './social-login-removed.event';
import { from } from 'rxjs';

@EventsHandler(SocialLoginRemovedEvent)
export class SocialLoginRemovedHandler
  implements IEventHandler<SocialLoginRemovedEvent> {
  handle(event: SocialLoginRemovedEvent) {
    const { socialLogin } = event;
    from(socialLogin.remove()).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
