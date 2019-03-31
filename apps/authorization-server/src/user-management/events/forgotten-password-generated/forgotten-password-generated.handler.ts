import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { from } from 'rxjs';
import { ForgottenPasswordGeneratedEvent } from './forgotten-password-generated.event';
import { EmailRequestService } from '../../../user-management/aggregates/email-request/email-request.service';

@EventsHandler(ForgottenPasswordGeneratedEvent)
export class ForgottenPasswordGeneratedHandler
  implements IEventHandler<ForgottenPasswordGeneratedEvent> {
  constructor(private readonly email: EmailRequestService) {}
  handle(event: ForgottenPasswordGeneratedEvent) {
    const { user } = event;
    from(user.save()).subscribe({
      next: success => {},
      error: error => {},
    });
    this.email.emailVerificationCode(user).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
