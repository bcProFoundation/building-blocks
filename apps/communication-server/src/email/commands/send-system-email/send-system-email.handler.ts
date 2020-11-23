import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { SendSystemEmailCommand } from './send-system-email.command';
import { SendEmailService } from '../../../email/aggregates/send-email/send-email.service';

@CommandHandler(SendSystemEmailCommand)
export class SendSystemEmailHandler
  implements ICommandHandler<SendSystemEmailCommand> {
  constructor(
    private readonly manager: SendEmailService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: SendSystemEmailCommand) {
    const { payload } = command;

    const aggregate = this.publisher.mergeObjectContext(this.manager);
    await aggregate.sendEmail(payload);
    aggregate.commit();
  }
}
