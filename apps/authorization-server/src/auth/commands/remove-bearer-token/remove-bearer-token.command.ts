import { ICommand } from '@nestjs/cqrs';

export class RemoveBearerTokenCommand implements ICommand {
  constructor(public readonly accessToken: string) {}
}
