import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { VerifyPhoneCommand } from './verify-phone.command';
import { OTPAggregateService } from '../../aggregates/otp-aggregate/otp-aggregate.service';

@CommandHandler(VerifyPhoneCommand)
export class VerifyPhoneHandler implements ICommandHandler<VerifyPhoneCommand> {
  constructor(
    private readonly manager: OTPAggregateService,
    private readonly publisher: EventPublisher,
  ) {}
  async execute(command: VerifyPhoneCommand) {
    const { userUuid, otp, request } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.verifyPhone(userUuid, otp, request);
    aggregate.commit();
  }
}
