import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { from } from 'rxjs';
import { UserRoleAddedEvent } from './user-role-added.event';
import { RoleService } from '../../entities/role/role.service';

@EventsHandler(UserRoleAddedEvent)
export class UserRoleAddedHandler implements IEventHandler<UserRoleAddedEvent> {
  constructor(private readonly role: RoleService) {}

  handle(event: UserRoleAddedEvent) {
    const { role } = event;
    from(this.role.save(role)).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
