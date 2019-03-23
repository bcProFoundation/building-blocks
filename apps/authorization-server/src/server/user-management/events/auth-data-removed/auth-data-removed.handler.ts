import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AuthDataRemovedEvent } from './auth-data-removed.event';
import { from } from 'rxjs';

@EventsHandler(AuthDataRemovedEvent)
export class AuthDataRemovedHandler
  implements IEventHandler<AuthDataRemovedEvent> {
  handle(event: AuthDataRemovedEvent) {
    const { authData } = event;
    from(authData.remove()).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
