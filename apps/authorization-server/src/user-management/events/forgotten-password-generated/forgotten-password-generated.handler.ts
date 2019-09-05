import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { from } from 'rxjs';
import { ForgottenPasswordGeneratedEvent } from './forgotten-password-generated.event';
import { EmailRequestService } from '../../aggregates/email-request/email-request.service';
import { UserService } from '../../entities/user/user.service';

@EventsHandler(ForgottenPasswordGeneratedEvent)
export class ForgottenPasswordGeneratedHandler
  implements IEventHandler<ForgottenPasswordGeneratedEvent> {
  constructor(
    private readonly email: EmailRequestService,
    private readonly user: UserService,
  ) {}
  handle(event: ForgottenPasswordGeneratedEvent) {
    const { user } = event;
    from(this.user.update(user)).subscribe({
      next: success => {},
      error: error => {},
    });
    this.email.emailVerificationCode(user).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
