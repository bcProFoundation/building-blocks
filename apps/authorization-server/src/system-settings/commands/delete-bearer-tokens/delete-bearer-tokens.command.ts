import { ICommand } from '@nestjs/cqrs';

export class DeleteBearerTokensCommand implements ICommand {
  constructor(public readonly actorUuid: string) {}
}
