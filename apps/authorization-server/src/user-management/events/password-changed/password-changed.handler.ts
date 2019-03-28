import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PasswordChangedEvent } from './password-changed.event';
import { from } from 'rxjs';

@EventsHandler(PasswordChangedEvent)
export class PasswordChangedHandler
  implements IEventHandler<PasswordChangedEvent> {
  handle(event: PasswordChangedEvent) {
    const { authData } = event;
    from(authData.save()).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
