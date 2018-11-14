// import './polyfills';
import * as fs from 'fs';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressServer } from './express-server';
import { ConfigService } from './config/config.service';
import { i18n } from './i18n/i18n.config';
import { VIEWS_DIR } from './constants/app-strings';

async function bootstrap() {
  const authServer = new ExpressServer(new ConfigService());
  authServer.setupSecurity();
  authServer.setupAssetDir();
  authServer.setupI18n();

  const app = await NestFactory.create(AppModule, authServer.server);

  const version = JSON.parse(
    fs.readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
  ).version;

  // Swagger
  const options = new DocumentBuilder()
    .setTitle(i18n.__('Authorization Server'))
    .setDescription(i18n.__('OAuth 2.0 OpenID Connect Authorization Server'))
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Handlebars View engine
  app.setBaseViewsDir(VIEWS_DIR);
  app.setViewEngine('hbs');

  // Enable CORS
  app.enableCors();

  // Enable Trust Proxy for session to work
  // https://github.com/expressjs/session/issues/281
  app.set('trust proxy', 1);

  authServer.setupSession(app);
  await app.listen(3000);
}

bootstrap();
