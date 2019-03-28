import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRoleRemovedEvent } from './user-role-removed.event';

@EventsHandler(UserRoleRemovedEvent)
export class UserRoleRemovedHandler
  implements IEventHandler<UserRoleRemovedEvent> {
  async handle(event: UserRoleRemovedEvent) {
    const { role } = event;
    await role.remove();
  }
}
