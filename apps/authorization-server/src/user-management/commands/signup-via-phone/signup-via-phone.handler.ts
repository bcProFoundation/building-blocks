import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';

import { SignupViaPhoneCommand } from './signup-via-phone.command';
import { OTPAggregateService } from '../../../auth/aggregates/otp-aggregate/otp-aggregate.service';

@CommandHandler(SignupViaPhoneCommand)
export class SignupViaPhoneHandler
  implements ICommandHandler<SignupViaPhoneCommand>
{
  constructor(
    private readonly manager: OTPAggregateService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: SignupViaPhoneCommand) {
    const { payload } = command;
    const aggregate = this.eventPublisher.mergeObjectContext(this.manager);

    const user = await aggregate.signupViaPhone(payload);
    aggregate.commit();
    return user;
  }
}
