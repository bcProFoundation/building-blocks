import { IEvent } from '@nestjs/cqrs';
import { User } from '../../entities/user/user.interface';
import { AuthData } from '../../entities/auth-data/auth-data.interface';

export class UserAccountAddedEvent implements IEvent {
  constructor(
    public readonly user: User,
    public readonly authData?: AuthData,
  ) {}
}
