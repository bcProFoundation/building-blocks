import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SystemEmailSentEvent } from './system-email-sent.event';
import { SendEmailService } from '../../../email/aggregates/send-email/send-email.service';
import { from } from 'rxjs';

@EventsHandler(SystemEmailSentEvent)
export class SystemEmailSentHandler
  implements IEventHandler<SystemEmailSentEvent> {
  constructor(private readonly sendEmail: SendEmailService) {}

  handle(event: SystemEmailSentEvent) {
    const { payload, email } = event;
    from(this.sendEmail.processMessage(payload, email)).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
