import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { ModifyClientCommand } from './modify-client.command';
import { ClientManagementAggregateService } from '../../aggregates';

@CommandHandler(ModifyClientCommand)
export class ModifyClientHandler
  implements ICommandHandler<ModifyClientCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: ClientManagementAggregateService,
  ) {}

  async execute(command: ModifyClientCommand) {
    const { clientId, payload, actorUuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const client = await aggregate.modifyClient(clientId, payload, actorUuid);
    aggregate.commit();
    return client;
  }
}
