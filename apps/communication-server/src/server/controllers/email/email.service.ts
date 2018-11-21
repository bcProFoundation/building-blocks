import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  BadRequestException,
} from '@nestjs/common';
import { Client, Transport, ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '../../config/config.service';
import { CHANNEL } from '../../rabbitmq/rabbitmq-connection';
import { SEND_EMAIL } from '../../constants/app-strings';
import { EmailAccountService } from '../../models/email-account/email-account.service';
import { ServerSettingsService } from '../../models/server-settings/server-settings.service';

const configService = new ConfigService();

@Injectable()
export class EmailService implements OnModuleInit, OnModuleDestroy {
  @Client({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getRabbitMQConfig()],
      queue: CHANNEL,
      queueOptions: { durable: true },
    },
  })
  client: ClientProxy;

  constructor(
    private readonly emailAccount: EmailAccountService,
    private readonly serverSettingsService: ServerSettingsService,
  ) {}
  async onModuleInit() {
    await this.client.connect();
  }

  onModuleDestroy() {
    this.client.close();
  }

  async findOne(params) {
    return await this.emailAccount.findOne(params);
  }

  async sendSystemMessage(
    to: string,
    subject: string,
    text: string,
    html: string,
  ) {
    const settings = await this.serverSettingsService.find();
    if (!settings.communicationServerSystemEmailAccount)
      throw new BadRequestException();
    const emailAccount = settings.communicationServerSystemEmailAccount;
    const emailAccountModel = await this.emailAccount.findOne({
      uuid: emailAccount,
    });
    const from = emailAccountModel.from;
    const pattern = { cmd: SEND_EMAIL };
    const message = { from, to, subject, text, html };
    const data = { message, emailAccount };
    return this.client.send(pattern, data);
  }

  sendMessage(
    to: string,
    from: string,
    subject: string,
    text: string,
    html: string,
  ) {
    const pattern = { cmd: SEND_EMAIL };
    const data = { from, to, subject, text, html };
    return this.client.send(pattern, data);
  }
}
