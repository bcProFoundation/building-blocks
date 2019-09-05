import { ICommand } from '@nestjs/cqrs';

export class UpdateClientSecretCommand implements ICommand {
  constructor(
    public readonly actorUuid: string,
    public readonly clientId: string,
  ) {}
}
