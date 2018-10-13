import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from './app.module';
import { RabbitMQServer } from './rabbitmq/rabbitmq-server';
import { CHANNEL } from './rabbitmq/rabbitmq-connection';
import { ConfigService } from './config/config.service';

const config = new ConfigService();
const server = express();
server.use(express.static(join(process.cwd(), 'dist/communication-server')));

async function bootstrap() {
  const app = await NestFactory.create(AppModule, server);
  const rabbitMQ = app.connectMicroservice({
    strategy: new RabbitMQServer(config.getRabbitMQConfig(), CHANNEL),
  });
  rabbitMQ.listen(() => {});
  await app.listen(4100);
}

bootstrap();
