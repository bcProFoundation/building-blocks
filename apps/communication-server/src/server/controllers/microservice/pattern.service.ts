import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailAccountService } from '../../models/email-account/email-account.service';
import { EmailAccount } from '../../models/email-account/email-account.entity';

@Injectable()
export class MicroservicePatternService {
  constructor(private readonly emailAccount: EmailAccountService) {}

  async processMessage(data) {
    const { message, emailAccount } = data;
    const transport = await this.getSMTPTransport(emailAccount);
    transport
      .sendMail(message)
      .then(info => {
        // console.log({ info });
        /*
        // TODO: Log Success Message
          {
              info: {
              accepted: [ 'revant@mntechnique.com' ],
              rejected: [],
              envelopeTime: 104,
              messageTime: 113,
              messageSize: 542,
              response: '250 2.0.0 Ok: queued as 3595160730',
              envelope: {
                from: 'noreply@mntechnique.com',
                to: [ 'revant@mntechnique.com' ]
              },
              messageId: '<3e13a33b-7342-8acc-ad75-b01ed00c63ae@mntechnique.com>'
            }
          }
         */
      })
      .catch(error => {
        /**
         * TODO: Log Error Message
         * { message: 'Missing credentials for "PLAIN"', code: 'EAUTH', command: 'API' }
         * console.log(error.message, error.code, error.command);
         */
      });
  }

  async getSMTPTransport(uuid) {
    const emailAccount: EmailAccount = await this.emailAccount.findOne({
      uuid,
    });
    // TODO: get from Email Account
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
