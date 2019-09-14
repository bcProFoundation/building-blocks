import { ICommand } from '@nestjs/cqrs';

export class RemoveUserAuthenticatorCommand implements ICommand {
  constructor(
    public readonly uuid: string,
    public readonly actorUuid: string,
    public readonly userUuid: string,
  ) {}
}
