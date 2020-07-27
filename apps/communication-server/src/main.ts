import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { setupRedis } from './redis-server';

async function bootstrap() {
  const server = new ExpressAdapter(express());
  const app = await NestFactory.create(AppModule, server);
  app.use(helmet());
  app.enableCors();
  setupSwagger(app);
  setupRedis(app);
  await app.listen(4100);
}
bootstrap();
