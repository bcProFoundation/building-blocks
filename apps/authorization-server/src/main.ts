import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ExpressServer } from './express-server';
import { ConfigService } from './config/config.service';
import { setupEvents } from './events-server';
const allowedOrigins = ['https://lixilotus.test','http://admin.localhost:4220','http://accounts.localhost:4210','http://myaccount.localhost:4420'];

async function bootstrap() {
  const authServer = new ExpressServer(new ConfigService());
  authServer.setupSecurity();
  authServer.setupI18n();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(authServer.server),
  );

  // Enable CORS
  app.enableCors({
    // eslint-disable-next-line object-shorthand
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    exposedHeaders: ["set-cookie"],
  });

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
