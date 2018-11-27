import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';
import {
  FOLDER_DIST_BROWSER,
  AVATAR_IMAGE_FOLDER,
  AVATAR_ROUTE_PREFIX,
} from './constants/filesystem';

async function bootstrap() {
  const server = express();
  server.use(express.static(FOLDER_DIST_BROWSER));
  server.use(AVATAR_ROUTE_PREFIX, express.static(AVATAR_IMAGE_FOLDER));
  const app = await NestFactory.create(AppModule, server);
  app.enableCors();
  await app.listen(3200);
}
bootstrap();
