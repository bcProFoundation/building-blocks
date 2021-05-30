import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { SocialLoginAddedEvent } from './social-login-added.event';
import { SocialLoginService } from '../../entities/social-login/social-login.service';

@EventsHandler(SocialLoginAddedEvent)
export class SocialLoginAddedHandler
  implements IEventHandler<SocialLoginAddedEvent>
{
  constructor(private readonly socialLogin: SocialLoginService) {}
  handle(event: SocialLoginAddedEvent) {
    this.socialLogin
      .save(event.socialLogin)
      .then(added => {})
      .catch(error => {});
  }
}
