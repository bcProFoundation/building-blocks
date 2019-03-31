import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Verify2FACommand } from './verify-2fa.command';
import { UserAggregateService } from '../../aggregates/user-aggregate/user-aggregate.service';

@CommandHandler(Verify2FACommand)
export class Verify2FAHandler implements ICommandHandler<Verify2FACommand> {
  constructor(
    private readonly manager: UserAggregateService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(command: Verify2FACommand) {
    const { userUuid, otp } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.verify2fa(userUuid, otp);
    aggregate.commit();
  }
}
