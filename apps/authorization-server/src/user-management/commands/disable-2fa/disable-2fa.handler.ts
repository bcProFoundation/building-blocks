import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Disable2FACommand } from './disable-2fa.command';
import { UserAggregateService } from '../../aggregates/user-aggregate/user-aggregate.service';

@CommandHandler(Disable2FACommand)
export class Disable2FAHandler implements ICommandHandler<Disable2FACommand> {
  constructor(
    private readonly manager: UserAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: Disable2FACommand) {
    const { userUuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.disable2fa(userUuid);
    aggregate.commit();
  }
}
