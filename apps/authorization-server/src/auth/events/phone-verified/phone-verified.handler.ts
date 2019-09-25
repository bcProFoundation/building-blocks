import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { from, forkJoin } from 'rxjs';
import { PhoneVerifiedEvent } from './phone-verified.event';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { UserService } from '../../../user-management/entities/user/user.service';

@EventsHandler(PhoneVerifiedEvent)
export class PhoneVerifiedHandler implements IEventHandler<PhoneVerifiedEvent> {
  constructor(
    private readonly user: UserService,
    private readonly authData: AuthDataService,
  ) {}
  handle(event: PhoneVerifiedEvent) {
    const { user, phoneOTP } = event;

    forkJoin(
      from(this.user.save(user)),
      from(this.authData.remove(phoneOTP)),
    ).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
