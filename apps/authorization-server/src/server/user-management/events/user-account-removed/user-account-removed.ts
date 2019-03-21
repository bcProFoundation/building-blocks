import { IEvent } from '@nestjs/cqrs';
import { User } from '../../entities/user/user.interface';
import { AuthData } from '../../entities/auth-data/auth-data.interface';

export class UserAccountRemovedEvent implements IEvent {
  constructor(
    public readonly actorUuid: string,
    public readonly deletedUser: User,
    public readonly password: AuthData,
    public readonly sharedSecret: AuthData,
    public readonly otpCounter: AuthData,
    public readonly twoFactorTempSecret: AuthData,
  ) {}
}
