import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AuthDataRemovedEvent } from './auth-data-removed.event';
import { from } from 'rxjs';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';

@EventsHandler(AuthDataRemovedEvent)
export class AuthDataRemovedHandler
  implements IEventHandler<AuthDataRemovedEvent> {
  constructor(private readonly authData: AuthDataService) {}

  handle(event: AuthDataRemovedEvent) {
    const { authData } = event;
    from(this.authData.remove(authData)).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
