import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserAuthenticatorModifiedEvent } from './user-authenticator-modified.event';
import { from } from 'rxjs';
import { UserAuthenticatorService } from '../../../user-management/entities/user-authenticator/user-authenticator.service';

@EventsHandler(UserAuthenticatorModifiedEvent)
export class UserAuthenticatorModifiedHandler
  implements IEventHandler<UserAuthenticatorModifiedEvent>
{
  constructor(private readonly authenticator: UserAuthenticatorService) {}
  handle(event: UserAuthenticatorModifiedEvent) {
    const { authKey } = event;
    from(this.authenticator.save(authKey)).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
