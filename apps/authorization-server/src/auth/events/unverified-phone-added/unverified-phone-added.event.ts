import { IEvent } from '@nestjs/cqrs';
import { User } from '../../../user-management/entities/user/user.interface';
import { AuthData } from '../../../user-management/entities/auth-data/auth-data.interface';

export class UnverifiedPhoneAddedEvent implements IEvent {
  constructor(
    public readonly user: User,
    public readonly phoneOTP: AuthData,
    public readonly hotp: string,
  ) {}
}
