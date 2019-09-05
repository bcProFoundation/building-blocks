import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SocialLoginRemovedEvent } from './social-login-removed.event';
import { from } from 'rxjs';
import { SocialLoginService } from '../../entities/social-login/social-login.service';

@EventsHandler(SocialLoginRemovedEvent)
export class SocialLoginRemovedHandler
  implements IEventHandler<SocialLoginRemovedEvent> {
  constructor(private readonly socialLogin: SocialLoginService) {}
  handle(event: SocialLoginRemovedEvent) {
    const { socialLogin } = event;
    from(this.socialLogin.remove(socialLogin)).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
