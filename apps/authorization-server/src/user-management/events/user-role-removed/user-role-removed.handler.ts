import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRoleRemovedEvent } from './user-role-removed.event';
import { RoleService } from '../../entities/role/role.service';

@EventsHandler(UserRoleRemovedEvent)
export class UserRoleRemovedHandler
  implements IEventHandler<UserRoleRemovedEvent>
{
  constructor(private readonly role: RoleService) {}

  async handle(event: UserRoleRemovedEvent) {
    const { role } = event;
    await this.role.remove(role);
  }
}
