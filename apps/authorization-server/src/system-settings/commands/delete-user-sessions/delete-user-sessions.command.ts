import { ICommand } from '@nestjs/cqrs';

export class DeleteUserSessionsCommand implements ICommand {
  constructor(public readonly actorUuid: string) {}
}
