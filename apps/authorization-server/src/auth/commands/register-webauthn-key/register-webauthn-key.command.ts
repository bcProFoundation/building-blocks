import { ICommand } from '@nestjs/cqrs';

export class RegisterWebAuthnKeyCommand implements ICommand {
  constructor(
    public readonly body: RequestBodyAsAny,
    public readonly actorUuid: string,
  ) {}
}

export type RequestBodyAsAny = any;
