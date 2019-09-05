import { IEvent } from '@nestjs/cqrs';
import { Role } from '../../entities/role/role.interface';

export class UserRoleModifiedEvent implements IEvent {
  constructor(
    public readonly role: Role,
    public readonly actorUserUuid: string,
  ) {}
}
