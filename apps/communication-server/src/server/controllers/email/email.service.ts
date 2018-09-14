import {
  Injectable,
  // HttpException,
  // HttpStatus,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
// import {
//   SETUP_ALREADY_COMPLETE,
//   COMMUNICATION_SERVER,
//   SYSTEM_EMAIL_ACCOUNT_NOT_FOUND,
// } from '../../constants/messages';
import * as nodemailer from 'nodemailer';
// import { EmailAccountService } from '../../models/email-account/email-account.service';
import { RabbitMQClient } from 'rabbitmq/rabbitmq-client';
import { ConfigService } from 'config/config.service';

@Injectable()
export class EmailService implements OnModuleInit, OnModuleDestroy {
  rabbitMQClient: RabbitMQClient;
  constructor(
    configService: ConfigService,
    // private readonly emailAccountService: EmailAccountService,
  ) {
    this.rabbitMQClient = new RabbitMQClient(
      configService.get('AMQP_URL'),
      'channel',
    );
  }

  async onModuleInit() {
    this.rabbitMQClient.connect();
  }

  async onModuleDestroy() {
    this.rabbitMQClient.close();
  }

  async sendMessage() {
    // const transport = await this.getSMTPTransport();
    // const message = {
    //   from: 'sender@server.com',
    //   to: 'receiver@sender.com',
    //   subject: 'Message title',
    //   text: 'Plaintext version of the message',
    //   html: '<p>HTML version of the message</p>',
    // };

    const pattern = { cmd: 'sum' };
    const data = [1, 2, 3];

    // console.log('publishing . . .');
    this.rabbitMQClient.publish(
      {
        pattern,
        data,
      },
      (err?, response?, isDisposed?) => {
        // console.log('Code in Publish!', { err, response, isDisposed });
      },
    );

    // transport.sendMail(message).then(info => {
    //   console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
    // });
  }

  async getSMTPTransport() {
    // const emailAccount = await this.emailAccountService.findOne(params);
    // if(!emailAccount) throw new HttpException(SYSTEM_EMAIL_ACCOUNT_NOT_FOUND, HttpStatus.BAD_REQUEST)
    // let selfSignedConfig = {
    //   host: emailAccount.host,
    //   port: emailAccount.port,
    //   secure: emailAccount.secure, // use TLS
    //   auth: {
    //       user: emailAccount.user,
    //       pass: emailAccount.pass,
    //   },
    //   tls: {
    //       // do not fail on invalid certs
    //       rejectUnauthorized: emailAccount.rejectUnauthorized,
    //   }
    // };
    // return nodemailer.createTransport(selfSignedConfig);
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'gmlexezocztzjal4@ethereal.email',
        pass: 'qCfkxWfztHqfrG2Ggd',
      },
    });
  }
}
