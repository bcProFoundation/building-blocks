// import './polyfills';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ExpressServer } from './express-server';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const authServer = new ExpressServer(new ConfigService());
  authServer.setupSecurity();
  authServer.setupAssetDir();
  authServer.setupI18n();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(authServer.server),
  );

  // Enable CORS
  app.enableCors();

  // Setup Swagger
  authServer.setupSwagger(app);

  // Setup Session
  authServer.setupSession(app);
  await app.listen(3000);
}

bootstrap();
