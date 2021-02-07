import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { VerifyEmailCommand } from './verify-email.command';
import { UserAggregateService } from '../../../user-management/aggregates/user-aggregate/user-aggregate.service';

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    private readonly manager: UserAggregateService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(command: VerifyEmailCommand) {
    const { verificationCode } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.verifyAndUpdateEmail({ verificationCode });
    aggregate.commit();
  }
}
