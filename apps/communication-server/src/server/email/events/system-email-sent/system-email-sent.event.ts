import { IEvent } from '@nestjs/cqrs';
import { EmailMessageAuthServerDto } from '../../../email/controllers/email/email-message-authserver-dto';
import { EmailAccount } from '../../../email/entities/email-account/email-account.entity';

export class SystemEmailSentEvent implements IEvent {
  constructor(
    public readonly payload: EmailMessageAuthServerDto,
    public readonly email: EmailAccount,
  ) {}
}
