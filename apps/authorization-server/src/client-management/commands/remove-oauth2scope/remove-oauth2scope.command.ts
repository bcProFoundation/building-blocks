import { ICommand } from '@nestjs/cqrs';

export class RemoveOAuth2ScopeCommand implements ICommand {
  constructor(
    public readonly actorUserUuid: string,
    public readonly scopeName: string,
  ) {}
}
