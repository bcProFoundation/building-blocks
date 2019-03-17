import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './app.module';
import { FOLDER_DIST_BROWSER } from './constants/filesystem';

async function bootstrap() {
  const server = new ExpressAdapter(express());
  server.use(express.static(FOLDER_DIST_BROWSER));
  const app = await NestFactory.create(AppModule, server);
  await app.listen(5000);
}
bootstrap();
