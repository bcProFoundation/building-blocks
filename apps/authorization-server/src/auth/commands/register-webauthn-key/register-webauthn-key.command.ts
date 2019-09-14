import { ICommand } from '@nestjs/cqrs';

export class RegisterWebAuthnKeyCommand implements ICommand {
  constructor(public readonly body: RequestBodyAsAny) {}
}

export type RequestBodyAsAny = any;
