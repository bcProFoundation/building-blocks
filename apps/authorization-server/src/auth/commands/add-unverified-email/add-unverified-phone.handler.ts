import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { UserAggregateService } from '../../../user-management/aggregates/user-aggregate/user-aggregate.service';
import { AddUnverifiedEmailCommand } from './add-unverified-phone.command';

@CommandHandler(AddUnverifiedEmailCommand)
export class AddUnverifiedEmailHandler
  implements ICommandHandler<AddUnverifiedEmailCommand> {
  constructor(
    private readonly manager: UserAggregateService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(command: AddUnverifiedEmailCommand) {
    const { userUuid, unverifiedEmail } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.addUnverifiedEmail(userUuid, unverifiedEmail);
    aggregate.commit();
  }
}
