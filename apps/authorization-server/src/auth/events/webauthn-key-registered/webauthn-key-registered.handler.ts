import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { from } from 'rxjs';
import { WebAuthnKeyRegisteredEvent } from './webauthn-key-registered.event';
import { UserAuthenticatorService } from '../../../user-management/entities/user-authenticator/user-authenticator.service';

@EventsHandler(WebAuthnKeyRegisteredEvent)
export class WebAuthnKeyRegisteredHandler
  implements IEventHandler<WebAuthnKeyRegisteredEvent>
{
  constructor(private readonly authenticator: UserAuthenticatorService) {}
  handle(event: WebAuthnKeyRegisteredEvent) {
    const { authenticator } = event;
    from(this.authenticator.save(authenticator)).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
