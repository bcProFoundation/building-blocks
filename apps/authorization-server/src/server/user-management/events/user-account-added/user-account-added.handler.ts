import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { UserAccountAddedEvent } from './user-account-added.event';

@EventsHandler(UserAccountAddedEvent)
export class UserAccountAddedHandler
  implements IEventHandler<UserAccountAddedEvent> {
  async handle(event: UserAccountAddedEvent) {
    const { user, authData } = event;
    await authData.save();
    await user.save();
  }
}
