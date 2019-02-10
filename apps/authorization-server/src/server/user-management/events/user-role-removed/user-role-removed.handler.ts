import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRoleRemovedEvent } from './user-role-removed.event';

@EventsHandler(UserRoleRemovedEvent)
export class UserRoleRemovedHandler
  implements IEventHandler<UserRoleRemovedEvent> {
  handle(event: UserRoleRemovedEvent) {
    // inform services
  }
}
