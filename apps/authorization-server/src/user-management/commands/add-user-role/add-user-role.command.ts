import { ICommand } from '@nestjs/cqrs';

export class AddUserRoleCommand implements ICommand {
  constructor(
    public readonly actorUuid: string,
    public readonly role: string,
  ) {}
}
