import { ICommand } from '@nestjs/cqrs';
import { EmailMessageAuthServerDto } from '../../../email/controllers/email/email-message-authserver-dto';

export class SendSystemEmailCommand implements ICommand {
  constructor(public readonly payload: EmailMessageAuthServerDto) {}
}
