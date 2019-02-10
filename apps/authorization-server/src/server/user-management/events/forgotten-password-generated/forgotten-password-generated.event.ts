import { IEvent } from '@nestjs/cqrs';
import { User } from '../../../user-management/entities/user/user.interface';

export class ForgottenPasswordGeneratedEvent implements IEvent {
  constructor(public readonly user: User) {}
}
