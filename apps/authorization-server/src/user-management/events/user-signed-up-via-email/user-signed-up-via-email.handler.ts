import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { forkJoin, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { UserSignedUpViaEmailEvent } from './user-signed-up-via-email.event';
import { UserService } from '../../entities/user/user.service';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';
import { EmailRequestService } from '../../aggregates/email-request/email-request.service';

@EventsHandler(UserSignedUpViaEmailEvent)
export class UserSignedUpViaEmailHandler
  implements IEventHandler<UserSignedUpViaEmailEvent>
{
  constructor(
    private readonly user: UserService,
    private readonly authData: AuthDataService,
    private readonly email: EmailRequestService,
  ) {}

  handle(event: UserSignedUpViaEmailEvent) {
    const { unverifiedUser, verificationCode } = event;

    forkJoin({
      user: from(this.user.save(unverifiedUser)),
      code: from(this.authData.save(verificationCode)),
    })
      .pipe(
        switchMap(({ user, code }) => {
          return from(this.email.emailRequest(user, code));
        }),
      )
      .subscribe({
        next: success => {},
        error: error => {},
      });
  }
}
