import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const server = new ExpressAdapter(express());
  const app = await NestFactory.create(AppModule, server);

  // Enable CORS
  app.enableCors();

  setupSwagger(app);
  await app.listen(5000);
}
bootstrap();
