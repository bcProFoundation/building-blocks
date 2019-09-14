import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserLoggedInWithWebAuthnEvent } from './user-logged-in-with-webauthn-key.event';

@EventsHandler(UserLoggedInWithWebAuthnEvent)
export class UserLoggedInWithWebAuthnHandler
  implements IEventHandler<UserLoggedInWithWebAuthnEvent> {
  handle(event: UserLoggedInWithWebAuthnEvent) {}
}
