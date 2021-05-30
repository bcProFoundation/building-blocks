import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { UserAccountAddedEvent } from './user-account-added.event';
import { UserService } from '../../entities/user/user.service';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';

@EventsHandler(UserAccountAddedEvent)
export class UserAccountAddedHandler
  implements IEventHandler<UserAccountAddedEvent>
{
  constructor(
    private readonly user: UserService,
    private readonly authData: AuthDataService,
  ) {}

  async handle(event: UserAccountAddedEvent) {
    const { user, authData } = event;

    if (authData) {
      await this.authData.save(authData);
    }
    await this.user.save(user);
  }
}
