// import './polyfills';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VIEWS_DIR } from './constants/locations';
import { ExpressServer } from './express-server';

async function bootstrap() {
  const authServer = new ExpressServer();
  authServer.setupSecurity();
  authServer.setupAssetDir();
  const app = await NestFactory.create(AppModule, authServer.server);
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

  authServer.setupSession(app);
  await authServer.setupCORS(app);
  await app.listen(3000);
}

bootstrap();
