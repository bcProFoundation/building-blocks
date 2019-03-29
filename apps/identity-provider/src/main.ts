import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import {
  AVATAR_IMAGE_FOLDER,
  AVATAR_ROUTE_PREFIX,
} from './constants/filesystem';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const server = new ExpressAdapter(express());
  server.use(AVATAR_ROUTE_PREFIX, express.static(AVATAR_IMAGE_FOLDER));
  const app = await NestFactory.create(AppModule, server);
  app.enableCors();
  setupSwagger(app);
  await app.listen(3200);
}
bootstrap();
