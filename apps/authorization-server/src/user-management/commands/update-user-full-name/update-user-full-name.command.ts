import { ICommand } from '@nestjs/cqrs';

export class UpdateUserFullNameCommand implements ICommand {
  constructor(
    public readonly actorUserUuid: string,
    public readonly name: string,
  ) {}
}
