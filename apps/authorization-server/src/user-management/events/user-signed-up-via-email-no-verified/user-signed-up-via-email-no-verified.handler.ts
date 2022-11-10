import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { forkJoin, from } from 'rxjs';

import { UserSignedUpViaEmailNoVerifiedEvent } from './user-signed-up-via-email-no-verified.event'
import { UserService } from '../../entities/user/user.service';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';

@EventsHandler(UserSignedUpViaEmailNoVerifiedEvent)
export class UserSignedUpViaEmailNoVerifiedHandler
  implements IEventHandler<UserSignedUpViaEmailNoVerifiedEvent>
{
  constructor(
    private readonly user: UserService,
    private readonly authData: AuthDataService,
  ) {}

  handle(event: UserSignedUpViaEmailNoVerifiedEvent) {
    const { unverifiedUser, userPassword } = event;

    forkJoin({
      user: from(this.user.save(unverifiedUser)),
      code: from(this.authData.save(userPassword)),
    }).subscribe({
        next: success => {},
        error: error => {},
    });
  }
}
