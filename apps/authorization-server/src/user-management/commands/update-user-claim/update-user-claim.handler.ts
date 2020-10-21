import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserClaimAggregateService } from '../../aggregates/user-claim-aggregate/user-claim-aggregate.service';
import { UpdateUserClaimCommand } from './update-user-claim.command';

@CommandHandler(UpdateUserClaimCommand)
export class UpdateUserClaimHandler
  implements ICommandHandler<UpdateUserClaimCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: UserClaimAggregateService,
  ) {}

  async execute(command: UpdateUserClaimCommand) {
    const { payload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const response = await aggregate.updateUserClaim(payload);
    aggregate.commit();
    return response;
  }
}
