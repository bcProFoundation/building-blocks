import { IEvent } from '@nestjs/cqrs';
import { User } from '../../../user-management/entities/user/user.interface';

export class UserLogInHOTPGeneratedEvent implements IEvent {
  constructor(public readonly user: User, public readonly hotp: string) {}
}
