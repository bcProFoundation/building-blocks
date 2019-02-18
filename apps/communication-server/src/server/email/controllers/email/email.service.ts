import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EmailAccountService } from '../../../email/entities/email-account/email-account.service';
import { EmailMessageAuthServerDto } from './email-message-authserver-dto';
import { SendSystemEmailCommand } from '../../../email/commands/send-system-email/send-system-email.command';

@Injectable()
export class EmailService {
  constructor(
    private readonly emailAccount: EmailAccountService,
    private readonly commandBus: CommandBus,
  ) {}

  async findOne(params) {
    return await this.emailAccount.findOne(params);
  }

  async sendSystemMessage(payload: EmailMessageAuthServerDto) {
    return await this.commandBus.execute(new SendSystemEmailCommand(payload));
  }
}
