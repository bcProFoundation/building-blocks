import { ICommand } from '@nestjs/cqrs';

export class WebAuthnRequestLoginCommand implements ICommand {
  constructor(public readonly username: string) {}
}
