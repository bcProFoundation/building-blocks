import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailVerifiedAndPasswordSetEvent } from './email-verified-and-password-set.event';
import { forkJoin, from } from 'rxjs';

@EventsHandler(EmailVerifiedAndPasswordSetEvent)
export class EmailVerifiedAndPasswordSetHandler
  implements IEventHandler<EmailVerifiedAndPasswordSetEvent> {
  handle(event: EmailVerifiedAndPasswordSetEvent) {
    const { verifiedUser, userPassword } = event;
    forkJoin(from(verifiedUser.save()), from(userPassword.save())).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
