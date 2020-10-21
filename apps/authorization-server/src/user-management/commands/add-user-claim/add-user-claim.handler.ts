import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserClaimAggregateService } from '../../aggregates/user-claim-aggregate/user-claim-aggregate.service';
import { AddUserClaimCommand } from './add-user-claim.command';

@CommandHandler(AddUserClaimCommand)
export class AddUserClaimHandler
  implements ICommandHandler<AddUserClaimCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly manager: UserClaimAggregateService,
  ) {}

  async execute(command: AddUserClaimCommand) {
    const { payload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    const response = await aggregate.addUserClaim(payload);
    aggregate.commit();
    return response;
  }
}
