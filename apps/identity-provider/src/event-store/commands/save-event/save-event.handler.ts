import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { SaveEventCommand } from './save-event.command';
import { EventStoreAggregateService } from '../../aggregates/event-store-aggregate/event-store-aggregate.service';

@CommandHandler(SaveEventCommand)
export class SaveEventHandler implements ICommandHandler<SaveEventCommand> {
  constructor(private readonly manager: EventStoreAggregateService) {}

  async execute(command: SaveEventCommand) {
    const { event } = command;
    this.manager.create(event.constructor.name, event).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
