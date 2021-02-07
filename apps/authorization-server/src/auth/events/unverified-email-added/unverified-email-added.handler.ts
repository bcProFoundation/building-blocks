import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { UnverifiedEmailAddedEvent } from './unverified-email-added.event';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { forkJoin, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EmailRequestService } from '../../../user-management/aggregates/email-request/email-request.service';

@EventsHandler(UnverifiedEmailAddedEvent)
export class UnverifiedEmailAddedHandler
  implements IEventHandler<UnverifiedEmailAddedEvent> {
  constructor(
    private readonly authData: AuthDataService,
    private readonly email: EmailRequestService,
  ) {}
  handle(event: UnverifiedEmailAddedEvent) {
    const { unverifiedEmail, verificationCode } = event;

    forkJoin({
      email: from(this.authData.save(unverifiedEmail)),
      code: from(this.authData.save(verificationCode)),
    })
      .pipe(
        switchMap(({ email, code }) => {
          return from(this.email.verifyEmail(email, code));
        }),
      )
      .subscribe({
        next: success => {},
        error: error => {},
      });
  }
}
