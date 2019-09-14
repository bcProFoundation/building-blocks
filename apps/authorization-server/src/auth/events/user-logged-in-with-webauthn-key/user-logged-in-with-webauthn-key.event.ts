import { IEvent } from '@nestjs/cqrs';
import { User } from '../../../user-management/entities/user/user.interface';
import { UserAuthenticator } from '../../../user-management/entities/user-authenticator/user-authenticator.interface';

export class UserLoggedInWithWebAuthnEvent implements IEvent {
  constructor(
    public readonly user: User,
    public readonly authenticator: UserAuthenticator,
  ) {}
}
