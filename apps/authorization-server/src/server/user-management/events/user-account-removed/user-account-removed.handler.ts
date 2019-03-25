import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserAccountRemovedEvent } from './user-account-removed';
import { UserDeleteRequestService } from '../../schedulers/user-delete-request/user-delete-request.service';
import { from } from 'rxjs';

@EventsHandler(UserAccountRemovedEvent)
export class UserAccountRemovedHandler
  implements IEventHandler<UserAccountRemovedEvent> {
  constructor(private readonly requestUserDelete: UserDeleteRequestService) {}

  handle(event: UserAccountRemovedEvent) {
    const {
      deletedUser,
      password,
      sharedSecret,
      otpCounter,
      twoFactorTempSecret,
    } = event;

    if (password) {
      from(password.remove()).subscribe({
        next: success => {},
        error: error => {},
      });
    }

    if (sharedSecret) {
      from(sharedSecret.remove()).subscribe({
        next: success => {},
        error: error => {},
      });
    }

    if (otpCounter) {
      from(otpCounter.remove()).subscribe({
        next: success => {},
        error: error => {},
      });
    }

    if (twoFactorTempSecret) {
      from(twoFactorTempSecret.remove()).subscribe({
        next: success => {},
        error: error => {},
      });
    }

    from(deletedUser.remove()).subscribe({
      next: success => {},
      error: error => {},
    });

    from(this.requestUserDelete.informClients(deletedUser.uuid)).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
