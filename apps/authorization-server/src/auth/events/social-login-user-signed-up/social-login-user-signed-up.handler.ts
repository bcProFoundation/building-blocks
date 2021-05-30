import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SocialLoginUserSignedUpEvent } from './social-login-user-signed-up.event';

@EventsHandler(SocialLoginUserSignedUpEvent)
export class UserSignedUpViaSocialLoginHandler
  implements IEventHandler<SocialLoginUserSignedUpEvent>
{
  handle(event: SocialLoginUserSignedUpEvent) {}
}
