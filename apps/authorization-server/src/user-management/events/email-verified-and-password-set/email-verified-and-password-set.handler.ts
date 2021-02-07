import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailVerifiedAndPasswordSetEvent } from './email-verified-and-password-set.event';
import { forkJoin, from } from 'rxjs';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';
import { UserService } from '../../entities/user/user.service';

@EventsHandler(EmailVerifiedAndPasswordSetEvent)
export class EmailVerifiedAndPasswordSetHandler
  implements IEventHandler<EmailVerifiedAndPasswordSetEvent> {
  constructor(
    private readonly user: UserService,
    private readonly authData: AuthDataService,
  ) {}
  handle(event: EmailVerifiedAndPasswordSetEvent) {
    const { verifiedUser, userPassword, verificationCode } = event;
    forkJoin({
      user: from(this.user.update(verifiedUser)),
      authData: from(this.authData.save(userPassword)),
      verificationCode: from(this.authData.remove(verificationCode)),
    }).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
