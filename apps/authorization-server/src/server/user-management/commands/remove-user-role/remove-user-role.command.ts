import { ICommand } from '@nestjs/cqrs';

export class RemoveUserRoleCommand implements ICommand {
  constructor(
    public readonly actorUserUuid: string,
    public readonly roleName: string,
  ) {}
}
