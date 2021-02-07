import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { forkJoin, from } from 'rxjs';
import { ForgottenPasswordGeneratedEvent } from './forgotten-password-generated.event';
import { EmailRequestService } from '../../aggregates/email-request/email-request.service';
import { UserService } from '../../entities/user/user.service';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';

@EventsHandler(ForgottenPasswordGeneratedEvent)
export class ForgottenPasswordGeneratedHandler
  implements IEventHandler<ForgottenPasswordGeneratedEvent> {
  constructor(
    private readonly email: EmailRequestService,
    private readonly user: UserService,
    private readonly authData: AuthDataService,
  ) {}
  handle(event: ForgottenPasswordGeneratedEvent) {
    const { user, verificationCode } = event;
    forkJoin({
      user: from(this.user.update(user)),
      verificationCode: from(this.authData.save(verificationCode)),
    }).subscribe({
      next: success => {},
      error: error => {},
    });
    this.email
      .emailForgottenPasswordVerificationCode(user, verificationCode)
      .subscribe({
        next: success => {},
        error: error => {},
      });
  }
}
