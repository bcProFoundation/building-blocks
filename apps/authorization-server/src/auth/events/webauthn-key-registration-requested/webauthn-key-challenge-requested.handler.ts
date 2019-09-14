import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { from } from 'rxjs';
import { WebAuthnKeyChallengeRequestedEvent } from './webauthn-key-challenge-requested.event';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';

@EventsHandler(WebAuthnKeyChallengeRequestedEvent)
export class WebAuthnKeyChallengeRequestedHandler
  implements IEventHandler<WebAuthnKeyChallengeRequestedEvent> {
  constructor(private readonly authData: AuthDataService) {}
  handle(event: WebAuthnKeyChallengeRequestedEvent) {
    const { authData } = event;
    from(this.authData.save(authData)).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
