import { ICommand } from '@nestjs/cqrs';

export class VerifyChangedClientSecretCommand implements ICommand {
  constructor(public readonly authorizationHeader: string) {}
}
