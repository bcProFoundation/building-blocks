import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ExpressServer } from './express-server';
import { ConfigService } from './config/config.service';
import { setupEvents } from './events-server';

async function bootstrap() {
  const authServer = new ExpressServer(new ConfigService());
  authServer.setupSecurity();
  authServer.setupI18n();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(authServer.server),
  );

  // Enable CORS
  app.enableCors();

  // Setup Swagger
  ExpressServer.setupSwagger(app);

  // Handlebars View engine
  ExpressServer.setupViewEngine(app);

  // Setup Session
  authServer.setupSession(app);

  // Setup Events
  setupEvents(app);

  await app.listen(3000);
}

bootstrap();
