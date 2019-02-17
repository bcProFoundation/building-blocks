import { Injectable, BadRequestException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import * as nodemailer from 'nodemailer';
import { EmailAccountService } from '../../../email/entities/email-account/email-account.service';
import { EmailAccount } from '../../../email/entities/email-account/email-account.entity';
import { QueueLogService } from '../../../system-settings/entities/queue-log/queue-log.service';
import { QueueLog } from '../../../system-settings/entities/queue-log/queue-log.entity';
import { SEND_EMAIL } from '../../../constants/app-strings';
import { SystemEmailSentEvent } from '../../../email/events/system-email-sent/system-email-sent.event';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { EmailMessageAuthServerDto } from '../../../email/controllers/email/email-message-authserver-dto';

@Injectable()
export class SendEmailService extends AggregateRoot {
  constructor(
    private readonly emailAccount: EmailAccountService,
    private readonly queueLogSerice: QueueLogService,
    private readonly settingsService: ServerSettingsService,
  ) {
    super();
  }

  async processMessage(
    payload: EmailMessageAuthServerDto,
    emailAccount: EmailAccount,
  ) {
    const message = {
      from: emailAccount.from,
      to: payload.emailTo,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    };

    const transport = await this.getSMTPTransport(emailAccount);
    transport
      .sendMail(message)
      .then(async success => {
        const log = new QueueLog();
        log.data = { success };
        log.senderType = SEND_EMAIL;
        log.senderUuid = emailAccount.uuid;
        await this.queueLogSerice.save(log);
      })
      .catch(async error => {
        const log = new QueueLog();
        log.data = { error };
        log.senderType = SEND_EMAIL;
        log.senderUuid = emailAccount.uuid;
        await this.queueLogSerice.save(log);
      });
  }

  async getSMTPTransport(emailAccount: EmailAccount) {
    return nodemailer.createTransport({
      host: emailAccount.host,
      port: emailAccount.port,
      auth: {
        user: emailAccount.user,
        pass: emailAccount.pass,
      },
    });
  }

  async sendEmail(payload) {
    const settings = await this.settingsService.find();
    if (!settings.communicationServerSystemEmailAccount)
      throw new BadRequestException({
        communicationServerSystemEmailAccount: 'NOT_SET',
      });
    const emailAccountUuid = settings.communicationServerSystemEmailAccount;
    const emailAccount = await this.emailAccount.findOne({
      uuid: emailAccountUuid,
    });

    this.apply(new SystemEmailSentEvent(payload, emailAccount));
  }
}
