import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { AddClientCommand } from './add-client.command';
import { ClientManagementAggregateService } from '../../aggregates';

@CommandHandler(AddClientCommand)
export class AddClientHandler implements ICommandHandler<AddClientCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: ClientManagementAggregateService,
  ) {}

  async execute(command: AddClientCommand) {
    const { payload, actorUuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const client = await aggregate.addClient(payload, actorUuid);
    aggregate.commit();
    return client;
  }
}
