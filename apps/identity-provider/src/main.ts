import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { setupEventStore } from './event-store';

async function bootstrap() {
  const server = new ExpressAdapter(express());
  const app = await NestFactory.create(AppModule, server);
  app.use(helmet());
  app.enableCors();
  setupSwagger(app);
  setupEventStore(app);
  await app.listen(3200);
}
bootstrap();
