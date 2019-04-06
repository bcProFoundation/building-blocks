import { ICommand } from '@nestjs/cqrs';

export class RemoveServiceCommand implements ICommand {
  constructor(public readonly clientId: string) {}
}
