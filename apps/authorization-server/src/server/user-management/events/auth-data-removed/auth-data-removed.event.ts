import { IEvent } from '@nestjs/cqrs';
import { AuthData } from '../../../user-management/entities/auth-data/auth-data.interface';

export class AuthDataRemovedEvent implements IEvent {
  constructor(public readonly authData: AuthData) {}
}
