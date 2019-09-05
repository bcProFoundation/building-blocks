import { ICommand } from '@nestjs/cqrs';

export class ModifyUserRoleCommand implements ICommand {
  constructor(
    public readonly actorUuid: string,
    public readonly uuid: string,
    public readonly role: string,
  ) {}
}
