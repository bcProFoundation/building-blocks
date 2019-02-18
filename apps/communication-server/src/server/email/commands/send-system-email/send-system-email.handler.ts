import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { SendSystemEmailCommand } from './send-system-email.command';
import { from } from 'rxjs';
import { SendEmailService } from '../../../email/aggregates/send-email/send-email.service';

@CommandHandler(SendSystemEmailCommand)
export class SendSystemEmailHandler
  implements ICommandHandler<SendSystemEmailCommand> {
  constructor(
    private readonly manager: SendEmailService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: SendSystemEmailCommand, resolve: (value?) => void) {
    const { payload } = command;
    const aggregate = this.publisher.mergeObjectContext(this.manager);

    from(this.manager.sendEmail(payload)).subscribe({
      next: success => resolve(aggregate.commit()),
      error: error => resolve(Promise.reject(error)),
    });
  }
}
