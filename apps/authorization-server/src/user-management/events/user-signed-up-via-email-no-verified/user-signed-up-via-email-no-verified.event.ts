import { IEvent } from '@nestjs/cqrs';
import { AuthData } from '../../entities/auth-data/auth-data.interface';
import { User } from '../../entities/user/user.interface';

export class UserSignedUpViaEmailNoVerifiedEvent implements IEvent {
  constructor(
    public readonly unverifiedUser: User,
    public readonly userPassword: AuthData,
  ) {}
}
