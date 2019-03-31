import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { UserAccountModifiedEvent } from './user-account-modified.event';

@EventsHandler(UserAccountModifiedEvent)
export class UserAccountModifiedHandler
  implements IEventHandler<UserAccountModifiedEvent> {
  async handle(event: UserAccountModifiedEvent) {
    const { user } = event;
    await user.save();
  }
}
