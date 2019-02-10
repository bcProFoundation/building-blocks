import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserAccountRemovedEvent } from './user-account-removed';
import { UserDeleteRequestService } from '../../../user-management/scheduler/user-delete-request.service';
import { from } from 'rxjs';

@EventsHandler(UserAccountRemovedEvent)
export class UserAccountRemovedHandler
  implements IEventHandler<UserAccountRemovedEvent> {
  constructor(private readonly requestUserDelete: UserDeleteRequestService) {}

  handle(event: UserAccountRemovedEvent) {
    const { deletedUser } = event;
    from(this.requestUserDelete.informClients(deletedUser.uuid)).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
