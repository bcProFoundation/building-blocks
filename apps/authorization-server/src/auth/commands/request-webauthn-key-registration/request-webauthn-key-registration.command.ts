import { ICommand } from '@nestjs/cqrs';

export class RequestWebAuthnKeyRegistrationCommand implements ICommand {
  constructor(
    public readonly actorUuid: string,
    public readonly userUuid: string,
  ) {}
}
