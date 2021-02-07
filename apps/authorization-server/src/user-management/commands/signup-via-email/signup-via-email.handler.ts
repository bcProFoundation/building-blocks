import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';

import { SignupViaEmailCommand } from './signup-via-email.command';
import { SignupService } from '../../aggregates/signup/signup.service';

@CommandHandler(SignupViaEmailCommand)
export class SignupViaEmailHandler
  implements ICommandHandler<SignupViaEmailCommand> {
  constructor(
    private readonly manager: SignupService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: SignupViaEmailCommand) {
    const { payload } = command;
    const aggregate = this.eventPublisher.mergeObjectContext(this.manager);

    const user = await aggregate.initSignupViaEmail(payload);
    aggregate.commit();
    return user;
  }
}
