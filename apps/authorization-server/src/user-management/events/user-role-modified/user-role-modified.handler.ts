import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { from } from 'rxjs';
import { UserRoleModifiedEvent } from './user-role-modified.event';
import { RoleService } from '../../entities/role/role.service';

@EventsHandler(UserRoleModifiedEvent)
export class UserRoleModifiedHandler
  implements IEventHandler<UserRoleModifiedEvent>
{
  constructor(private readonly role: RoleService) {}

  handle(event: UserRoleModifiedEvent) {
    const { role } = event;
    from(this.role.save(role)).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
