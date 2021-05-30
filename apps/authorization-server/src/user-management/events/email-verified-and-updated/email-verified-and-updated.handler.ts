import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EmailVerifiedAndUpdatedEvent } from './email-verified-and-updated.event';
import { UserService } from '../../entities/user/user.service';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';

@EventsHandler(EmailVerifiedAndUpdatedEvent)
export class EmailVerifiedAndUpdatedHandler
  implements IEventHandler<EmailVerifiedAndUpdatedEvent>
{
  constructor(
    private readonly user: UserService,
    private readonly authData: AuthDataService,
  ) {}
  handle(event: EmailVerifiedAndUpdatedEvent) {
    const { verifiedUser, verifiedEmail, verificationCode } = event;
    from(this.user.update(verifiedUser))
      .pipe(
        switchMap(user => {
          if (verifiedEmail) {
            return from(this.authData.remove(verifiedEmail));
          }
          return of(user);
        }),
        switchMap(user => {
          if (verificationCode) {
            return from(this.authData.remove(verificationCode));
          }
          return of(user);
        }),
      )
      .subscribe({
        next: success => {},
        error: error => {},
      });
  }
}
