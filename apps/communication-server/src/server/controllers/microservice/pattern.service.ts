import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailAccountService } from '../../models/email-account/email-account.service';
import { EmailAccount } from '../../models/email-account/email-account.entity';
import { QueueLogService } from '../../models/queue-log/queue-log.service';
import { QueueLog } from '../../models/queue-log/queue-log.entity';
import { SEND_EMAIL } from '../../constants/app-strings';

@Injectable()
export class MicroservicePatternService {
  constructor(
    private readonly emailAccount: EmailAccountService,
    private readonly queueLogSerice: QueueLogService,
  ) {}

  async processMessage(data) {
    const { message, emailAccount } = data;
    const transport = await this.getSMTPTransport(emailAccount);
    transport
      .sendMail(message)
      .then(async success => {
        const log = new QueueLog();
        log.data = { success };
        log.senderType = SEND_EMAIL;
        log.senderUuid = emailAccount;
        await this.queueLogSerice.save(log);
      })
      .catch(async error => {
        const log = new QueueLog();
        log.data = { error };
        log.senderType = SEND_EMAIL;
        log.senderUuid = emailAccount;
        await this.queueLogSerice.save(log);
      });
  }

  async getSMTPTransport(uuid) {
    const emailAccount: EmailAccount = await this.emailAccount.findOne({
      uuid,
    });
    return nodemailer.createTransport({
      host: emailAccount.host,
      port: emailAccount.port,
      auth: {
        user: emailAccount.user,
        pass: emailAccount.pass,
      },
    });
  }
}
