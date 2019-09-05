import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { UpdateClientSecretCommand } from './update-client-secret.command';
import { ClientManagementAggregateService } from '../../aggregates';

@CommandHandler(UpdateClientSecretCommand)
export class UpdateClientSecretHandler
  implements ICommandHandler<UpdateClientSecretCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: ClientManagementAggregateService,
  ) {}

  async execute(command: UpdateClientSecretCommand) {
    const { clientId, actorUuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const client = await aggregate.updateClientSecret(clientId, actorUuid);
    aggregate.commit();
    return client;
  }
}
