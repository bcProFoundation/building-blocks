import { IEvent } from '@nestjs/cqrs';
import { AuthData } from '../../entities/auth-data/auth-data.interface';
import { User } from '../../entities/user/user.interface';

export class ForgottenPasswordGeneratedEvent implements IEvent {
  constructor(
    public readonly user: User,
    public readonly verificationCode: AuthData,
  ) {}
}
