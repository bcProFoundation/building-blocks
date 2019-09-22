import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserLogInHOTPGeneratedEvent } from './user-login-hotp-generated.event';

@EventsHandler(UserLogInHOTPGeneratedEvent)
export class UserLogInHOTPGeneratedHandler
  implements IEventHandler<UserLogInHOTPGeneratedEvent> {
  handle(event: UserLogInHOTPGeneratedEvent) {}
}
