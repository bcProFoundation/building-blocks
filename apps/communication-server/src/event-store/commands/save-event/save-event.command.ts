import { ICommand, IEvent } from '@nestjs/cqrs';

export class SaveEventCommand implements ICommand {
  constructor(public readonly event: IEvent) {}
}
