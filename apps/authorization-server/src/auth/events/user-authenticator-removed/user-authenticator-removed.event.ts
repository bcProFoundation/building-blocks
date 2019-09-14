import { IEvent } from '@nestjs/cqrs';
import { UserAuthenticator } from '../../../user-management/entities/user-authenticator/user-authenticator.interface';

export class UserAuthenticatorRemovedEvent implements IEvent {
  constructor(public readonly authKey: UserAuthenticator) {}
}
