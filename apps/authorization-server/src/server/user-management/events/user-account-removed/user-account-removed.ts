import { IEvent } from '@nestjs/cqrs';
import { User } from '../../../user-management/entities/user/user.interface';

export class UserAccountRemovedEvent implements IEvent {
  constructor(
    public readonly deletedUser: User,
    public readonly actorUuid: string,
  ) {}
}
