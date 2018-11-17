import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from './app.module';
import { CHANNEL } from './rabbitmq/rabbitmq-connection';
import { ConfigService } from './config/config.service';
import { Transport } from '@nestjs/microservices';
import * as bodyParser from 'body-parser';

const config = new ConfigService();

async function bootstrap() {
  const server = express();
  server.use(express.static(join(process.cwd(), 'dist/communication-server')));
  server.use(bodyParser.raw({ inflate: true }));
  const rabbitUrl = config.getRabbitMQConfig();
  const app = await NestFactory.create(AppModule, server);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitUrl],
      queue: CHANNEL,
      queueOptions: { durable: true },
    },
  });
  await app.startAllMicroservicesAsync();
  await app.listen(4100);
}

bootstrap();
