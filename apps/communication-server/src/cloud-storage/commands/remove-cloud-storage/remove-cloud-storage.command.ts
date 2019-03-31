import { ICommand } from '@nestjs/cqrs';

export class RemoveCloudStorageCommand implements ICommand {
  constructor(
    public readonly actorUuid: string,
    public readonly uuid: string,
  ) {}
}
