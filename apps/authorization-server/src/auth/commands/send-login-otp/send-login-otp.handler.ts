import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { SendLoginOTPCommand } from './send-login-otp.command';
import { OTPAggregateService } from '../../aggregates/otp-aggregate/otp-aggregate.service';

@CommandHandler(SendLoginOTPCommand)
export class SendLoginOTPHandler
  implements ICommandHandler<SendLoginOTPCommand> {
  constructor(
    private publisher: EventPublisher,
    private readonly otpAggregate: OTPAggregateService,
  ) {}
  async execute(command: SendLoginOTPCommand) {
    const { user } = command;
    const aggregate = this.publisher.mergeObjectContext(this.otpAggregate);
    await aggregate.sendLoginOTP(user);
    aggregate.commit();
    return user;
  }
}
