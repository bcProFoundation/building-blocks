import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { UnverifiedPhoneAddedEvent } from './unverified-phone-added.event';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { from } from 'rxjs';

@EventsHandler(UnverifiedPhoneAddedEvent)
export class UnverifiedPhoneAddedHandler
  implements IEventHandler<UnverifiedPhoneAddedEvent>
{
  constructor(private readonly authData: AuthDataService) {}
  handle(event: UnverifiedPhoneAddedEvent) {
    const { phoneOTP } = event;

    from(this.authData.save(phoneOTP)).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
