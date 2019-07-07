import { ICommand } from '@nestjs/cqrs';

export class DeleteFileFromStorageCommand implements ICommand {
  constructor(
    public readonly filename: string,
    public readonly storageUuid: string,
    public readonly req: any,
  ) {}
}
