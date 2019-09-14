import { IEvent } from '@nestjs/cqrs';
import { UserAuthenticator } from '../../../user-management/entities/user-authenticator/user-authenticator.interface';

export class WebAuthnKeyRegisteredEvent implements IEvent {
  constructor(public readonly authenticator: UserAuthenticator) {}
}
