import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { SocialLoginModifiedEvent } from './social-login-modified.event';
import { SocialLoginService } from '../../entities/social-login/social-login.service';

@EventsHandler(SocialLoginModifiedEvent)
export class SocialLoginModifiedHandler
  implements IEventHandler<SocialLoginModifiedEvent> {
  constructor(private readonly socialLogin: SocialLoginService) {}
  handle(event: SocialLoginModifiedEvent) {
    this.socialLogin
      .save(event.socialLogin)
      .then(modified => {})
      .catch(error => {});
  }
}
