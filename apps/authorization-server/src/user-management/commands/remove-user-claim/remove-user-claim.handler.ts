import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserClaimAggregateService } from '../../aggregates/user-claim-aggregate/user-claim-aggregate.service';
import { RemoveUserClaimCommand } from './remove-user-claim.command';

@CommandHandler(RemoveUserClaimCommand)
export class RemoveUserClaimHandler
  implements ICommandHandler<RemoveUserClaimCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: UserClaimAggregateService,
  ) {}

  async execute(command: RemoveUserClaimCommand) {
    const { uuid, name } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const response = await aggregate.removeUserClaim(uuid, name);
    aggregate.commit();
    return response;
  }
}
