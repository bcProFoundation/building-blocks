import { IEvent } from '@nestjs/cqrs';
import { Role } from '../../../user-management/entities/role/role.interface';

export class UserRoleRemovedEvent implements IEvent {
  constructor(
    public readonly role: Role,
    public readonly actorUserUuid: string,
  ) {}
}
