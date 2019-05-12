import { ICommand } from '@nestjs/cqrs';

export class RemoveOAuth2ProviderCommand implements ICommand {
  constructor(
    public readonly providerUuid: string,
    public readonly actorUuid: string,
  ) {}
}
