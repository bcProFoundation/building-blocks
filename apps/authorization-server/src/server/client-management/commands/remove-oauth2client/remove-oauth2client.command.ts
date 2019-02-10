import { ICommand } from '@nestjs/cqrs';

export class RemoveOAuth2ClientCommand implements ICommand {
  constructor(
    public readonly actorUserUuid: string,
    public readonly clientId: string,
  ) {}
}
