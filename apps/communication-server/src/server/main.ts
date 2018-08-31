import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from './app.module';
import { RabbitMQServer } from './rabbitmq/rabbitmq-server';
import { ConfigService } from './config/config.service';

const configService = new ConfigService();

const server = express();
server.use(express.static(join(process.cwd(), 'dist/communication-server')));

async function bootstrap() {
  const app = await NestFactory.create(AppModule, server);
  const rabbitMQ = app.connectMicroservice({
    strategy: new RabbitMQServer(configService.get('AMQP_URL'), 'channel'),
  });
  rabbitMQ.listen(() => {});
  await app.listen(4010);
}

bootstrap();
