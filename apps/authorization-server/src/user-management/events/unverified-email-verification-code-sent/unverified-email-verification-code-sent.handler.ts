import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { UnverifiedEmailVerificationCodeSentEvent } from './unverified-email-verification-code-sent.event';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';
import { EmailRequestService } from '../../aggregates/email-request/email-request.service';

@EventsHandler(UnverifiedEmailVerificationCodeSentEvent)
export class UnverifiedEmailVerificationCodeSentHandler
  implements IEventHandler<UnverifiedEmailVerificationCodeSentEvent> {
  constructor(
    private readonly authData: AuthDataService,
    private readonly email: EmailRequestService,
  ) {}

  handle(event: UnverifiedEmailVerificationCodeSentEvent) {
    const { unverifiedUser, verificationCode } = event;

    from(this.authData.save(verificationCode))
      .pipe(
        switchMap(code => {
          return from(
            this.email.sendUnverifiedEmailVerificationCode(
              unverifiedUser,
              code,
            ),
          );
        }),
      )
      .subscribe({
        next: success => {},
        error: error => {},
      });
  }
}
