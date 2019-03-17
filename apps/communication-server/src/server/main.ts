import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const server = new ExpressAdapter(express());
  server.use(express.static(join(process.cwd(), 'dist/communication-server')));

  const app = await NestFactory.create(AppModule, server);
  app.enableCors();
  await app.listen(4100);
}

bootstrap();
