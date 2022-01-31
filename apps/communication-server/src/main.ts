import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { setupEvents } from './events-server';

async function bootstrap() {
  const server = new ExpressAdapter(express());
  const app = await NestFactory.create(AppModule, server);
  app.use(helmet());
  app.enableCors();
  setupSwagger(app);
  setupEvents(app);
  await app.listen(4100);
}
bootstrap();
