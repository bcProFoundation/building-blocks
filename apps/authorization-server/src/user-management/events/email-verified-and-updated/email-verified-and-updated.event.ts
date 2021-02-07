import { IEvent } from '@nestjs/cqrs';
import { AuthData } from '../../entities/auth-data/auth-data.interface';
import { User } from '../../entities/user/user.interface';

export class EmailVerifiedAndUpdatedEvent implements IEvent {
  constructor(
    public readonly verifiedUser: User,
    public readonly verifiedEmail: AuthData,
    public readonly verificationCode: AuthData,
  ) {}
}
