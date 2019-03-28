import { IEvent } from '@nestjs/cqrs';
import { User } from '../../entities/user/user.interface';

export class UserAccountModifiedEvent implements IEvent {
  constructor(public readonly user: User) {}
}
