import { ICommand } from '@nestjs/cqrs';

export class RemoveServiceTypeCommand implements ICommand {
  constructor(public readonly name: string) {}
}
