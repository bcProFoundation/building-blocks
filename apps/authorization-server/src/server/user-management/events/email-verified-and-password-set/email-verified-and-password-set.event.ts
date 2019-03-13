import { IEvent } from '@nestjs/cqrs';
import { User } from '../../entities/user/user.interface';
import { AuthData } from '../../entities/auth-data/auth-data.interface';

export class EmailVerifiedAndPasswordSetEvent implements IEvent {
  constructor(
    public readonly verifiedUser: User,
    public readonly userPassword: AuthData,
  ) {}
}
