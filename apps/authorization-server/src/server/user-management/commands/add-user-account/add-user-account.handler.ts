import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { AddUserAccountCommand } from './add-user-account.command';
import { UserAggregateService } from '../../aggregates/user-aggregate/user-aggregate.service';

@CommandHandler(AddUserAccountCommand)
export class AddUserAccountHandler
  implements ICommandHandler<AddUserAccountCommand> {
  constructor(
    private readonly manager: UserAggregateService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: AddUserAccountCommand) {
    const { actorUuid, userData } = command;
    const aggregate = this.eventPublisher.mergeObjectContext(this.manager);

    const user = await aggregate.addUserAccount(userData, actorUuid);
    aggregate.commit();
    return user;
  }
}
