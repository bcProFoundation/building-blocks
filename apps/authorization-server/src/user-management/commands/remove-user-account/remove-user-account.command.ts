import { ICommand } from '@nestjs/cqrs';

export class RemoveUserAccountCommand implements ICommand {
  constructor(
    public readonly actorUserUuid: string,
    public readonly userUuidToBeDeleted: string,
    public readonly clientId?: string,
  ) {}
}
