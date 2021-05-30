import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { EmailVerificationCodeCommand } from './email-verification-code.command';
import { SignupService } from '../../aggregates/signup/signup.service';

@CommandHandler(EmailVerificationCodeCommand)
export class EmailVerificationCodeHandler
  implements ICommandHandler<EmailVerificationCodeCommand>
{
  constructor(
    private publisher: EventPublisher,
    private readonly otpAggregate: SignupService,
  ) {}
  async execute(command: EmailVerificationCodeCommand) {
    const { userUuid } = command;
    const aggregate = this.publisher.mergeObjectContext(this.otpAggregate);
    await aggregate.sendUnverifiedEmailVerificationCode(userUuid);
    aggregate.commit();
    return { userUuid };
  }
}
