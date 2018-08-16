// import './polyfills';

// import 'zone.js/dist/zone-node';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { VIEWS_DIR } from './constants/locations';
import { setupSession } from './setup';

const server = express();
server.use(express.static(join(process.cwd(), 'dist/authorization-server')));

async function bootstrap() {
  const app = await NestFactory.create(AppModule, server);

  // const BROWSER_DIR = join(process.cwd(), 'dist', 'authorization-server');
  // app.useStaticAssets(BROWSER_DIR);

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('Craft Building Blocks')
    .setDescription('Buidling Blocks for apps built under Craft')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Handlebars View engine
  app.setBaseViewsDir(VIEWS_DIR);
  app.setViewEngine('hbs');

  setupSession(app);

  await app.listen(3000);
}

bootstrap();
