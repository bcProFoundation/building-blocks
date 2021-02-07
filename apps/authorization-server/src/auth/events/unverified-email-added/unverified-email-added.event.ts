import { IEvent } from '@nestjs/cqrs';
import { AuthData } from '../../../user-management/entities/auth-data/auth-data.interface';

export class UnverifiedEmailAddedEvent implements IEvent {
  constructor(
    public readonly unverifiedEmail: AuthData,
    public readonly verificationCode: AuthData,
  ) {}
}
