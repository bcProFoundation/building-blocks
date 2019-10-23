import { ICommand } from '@nestjs/cqrs';

export class DeleteProfileCommand implements ICommand {
  constructor(public readonly uuid: string) {}
}
