import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { RemoveBearerTokenCommand } from './remove-bearer-token.command';
import { BearerTokenManagerService } from '../../aggregates/bearer-token-manager/bearer-token-manager.service';

@CommandHandler(RemoveBearerTokenCommand)
export class RemoveBearerTokenHandler
  implements ICommandHandler<RemoveBearerTokenCommand>
{
  constructor(
    private readonly manager: BearerTokenManagerService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: RemoveBearerTokenCommand) {
    const { accessToken } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const message = await aggregate.removeToken(accessToken);
    aggregate.commit();
    return message;
  }
}
