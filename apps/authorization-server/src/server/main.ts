// import './polyfills';
import * as fs from 'fs';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VIEWS_DIR } from './constants/locations';
import { ExpressServer } from './express-server';
import { APP_NAME, APP_DESCRIPTION } from './constants/messages';

async function bootstrap() {
  const authServer = new ExpressServer();
  authServer.setupSecurity();
  authServer.setupAssetDir();
  const app = await NestFactory.create(AppModule, authServer.server);

  const version = JSON.parse(
    fs.readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
  ).version;

  // Swagger
  const options = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(APP_DESCRIPTION)
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Handlebars View engine
  app.setBaseViewsDir(VIEWS_DIR);
  app.setViewEngine('hbs');

  authServer.setupSession(app);
  await authServer.setupCORS(app);
  await app.listen(3000);
}

bootstrap();
