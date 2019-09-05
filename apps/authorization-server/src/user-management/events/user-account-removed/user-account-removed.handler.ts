import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserAccountRemovedEvent } from './user-account-removed';
import { UserDeleteRequestService } from '../../schedulers/user-delete-request/user-delete-request.service';
import { from } from 'rxjs';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';
import { UserService } from '../../entities/user/user.service';

@EventsHandler(UserAccountRemovedEvent)
export class UserAccountRemovedHandler
  implements IEventHandler<UserAccountRemovedEvent> {
  constructor(
    private readonly requestUserDelete: UserDeleteRequestService,
    private readonly authData: AuthDataService,
    private readonly user: UserService,
  ) {}

  handle(event: UserAccountRemovedEvent) {
    const {
      deletedUser,
      password,
      sharedSecret,
      otpCounter,
      twoFactorTempSecret,
    } = event;

    if (password) {
      from(this.authData.remove(password)).subscribe({
        next: success => {},
        error: error => {},
      });
    }

    if (sharedSecret) {
      from(this.authData.remove(sharedSecret)).subscribe({
        next: success => {},
        error: error => {},
      });
    }

    if (otpCounter) {
      from(this.authData.remove(otpCounter)).subscribe({
        next: success => {},
        error: error => {},
      });
    }

    if (twoFactorTempSecret) {
      from(this.authData.remove(twoFactorTempSecret)).subscribe({
        next: success => {},
        error: error => {},
      });
    }

    from(this.user.remove(deletedUser)).subscribe({
      next: success => {},
      error: error => {},
    });

    from(this.requestUserDelete.informClients(deletedUser.uuid)).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
