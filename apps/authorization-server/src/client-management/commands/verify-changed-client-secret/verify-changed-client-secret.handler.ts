import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { VerifyChangedClientSecretCommand } from './verify-changed-client-secret.command';
import { ClientManagementAggregateService } from '../../aggregates';

@CommandHandler(VerifyChangedClientSecretCommand)
export class VerifyChangedClientSecretHandler
  implements ICommandHandler<VerifyChangedClientSecretCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: ClientManagementAggregateService,
  ) {}

  async execute(command: VerifyChangedClientSecretCommand) {
    const { authorizationHeader } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const client = await aggregate.verifyChangedSecret(authorizationHeader);
    aggregate.commit();
    return client;
  }
}
