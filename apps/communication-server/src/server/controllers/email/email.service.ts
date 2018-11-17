import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client, Transport, ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '../../config/config.service';
import { CHANNEL } from '../../rabbitmq/rabbitmq-connection';
import { SEND_EMAIL } from '../../constants/app-strings';

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

  async onModuleInit() {
    await this.client.connect();
  }

  onModuleDestroy() {
    this.client.close();
  }

  sendSystemMessage(
    emailTo: string,
    subject: string,
    text: string,
    html: string,
  ) {
    // TODO: Get email from isSystemEmail account
    const emailFrom = 'noreply@mntechnique.com';

    const pattern = { cmd: SEND_EMAIL };
    const data = {
      from: emailFrom,
      to: emailTo,
      subject,
      text,
      html,
    };
    return this.client.send(pattern, data);
  }

  sendMessage(
    emailTo: string,
    emailFrom: string,
    subject: string,
    text: string,
    html: string,
  ) {
    const pattern = { cmd: SEND_EMAIL };
    const data = {
      from: emailFrom,
      to: emailTo,
      subject,
      text,
      html,
    };
    return this.client.send(pattern, data);
  }
}
