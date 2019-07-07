import { ICommand } from '@nestjs/cqrs';

export class DeleteAvatarCommand implements ICommand {
  constructor(
    public readonly profileUuid: string,
    public readonly req: { [key: string]: any },
  ) {}
}
