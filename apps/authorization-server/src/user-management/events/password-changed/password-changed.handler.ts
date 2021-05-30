import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { from } from 'rxjs';
import { PasswordChangedEvent } from './password-changed.event';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';

@EventsHandler(PasswordChangedEvent)
export class PasswordChangedHandler
  implements IEventHandler<PasswordChangedEvent>
{
  constructor(private readonly authData: AuthDataService) {}
  handle(event: PasswordChangedEvent) {
    const { authData } = event;
    from(this.authData.save(authData)).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
