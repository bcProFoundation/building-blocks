import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { from } from 'rxjs';
import { UserClaimService } from '../../../auth/entities/user-claim/user-claim.service';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';
import { USER } from '../../entities/user/user.schema';
import { UserService } from '../../entities/user/user.service';
import { UserAccountRemovedEvent } from './user-account-removed';

@EventsHandler(UserAccountRemovedEvent)
export class UserAccountRemovedHandler
  implements IEventHandler<UserAccountRemovedEvent>
{
  constructor(
    private readonly authData: AuthDataService,
    private readonly user: UserService,
    private readonly userClaim: UserClaimService,
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

    from(this.userClaim.deleteMany({ uuid: deletedUser.uuid })).subscribe({
      next: success => {},
      error: error => {},
    });

    from(this.user.remove(deletedUser)).subscribe({
      next: success => {},
      error: error => {},
    });

    from(
      this.authData.deleteMany({
        entity: USER,
        entityUuid: deletedUser.uuid,
      }),
    ).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
