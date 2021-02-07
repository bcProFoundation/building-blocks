import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { VerifyEmailAndSetPasswordCommand } from './verify-email-and-set-password.command';
import { UserAggregateService } from '../../aggregates/user-aggregate/user-aggregate.service';

@CommandHandler(VerifyEmailAndSetPasswordCommand)
export class VerifyEmailAndSetPasswordHandler
  implements ICommandHandler<VerifyEmailAndSetPasswordCommand> {
  constructor(
    private readonly manager: UserAggregateService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: VerifyEmailAndSetPasswordCommand) {
    const { payload } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.verifyEmailAndSetPassword(payload);
    aggregate.commit();
  }
}
