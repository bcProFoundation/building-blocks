import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';

import { SignupViaEmailNoVerifiedCommand } from './signup-via-email-no-verified.command';
import { SignupService } from '../../aggregates/signup/signup.service';

@CommandHandler(SignupViaEmailNoVerifiedCommand)
export class SignupViaEmailNoVerifiedHandler
  implements ICommandHandler<SignupViaEmailNoVerifiedCommand>
{
  constructor(
    private readonly manager: SignupService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: SignupViaEmailNoVerifiedCommand) {
    const { payload } = command;
    const aggregate = this.eventPublisher.mergeObjectContext(this.manager);

    const user = await aggregate.initSignupViaEmailNoVerified(payload);
    aggregate.commit();
    return user;
  }
}
