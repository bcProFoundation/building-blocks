import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { UserAccountModifiedEvent } from './user-account-modified.event';
import { UserService } from '../../entities/user/user.service';

@EventsHandler(UserAccountModifiedEvent)
export class UserAccountModifiedHandler
  implements IEventHandler<UserAccountModifiedEvent> {
  constructor(private readonly user: UserService) {}
  async handle(event: UserAccountModifiedEvent) {
    const { user } = event;
    await this.user.update(user);
  }
}
