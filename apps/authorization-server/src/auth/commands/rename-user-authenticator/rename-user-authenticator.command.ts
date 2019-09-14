import { ICommand } from '@nestjs/cqrs';

export class RenameUserAuthenticatorCommand implements ICommand {
  constructor(
    public readonly uuid: string,
    public readonly name: string,
    public readonly actorUuid: string,
  ) {}
}
