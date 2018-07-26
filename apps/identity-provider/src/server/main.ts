import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import * as passport from 'passport';
import { TypeormStore } from 'nestjs-session-store';
import { ConfigService } from 'config/config.service';
import { getRepository } from 'typeorm';
import { User } from 'models/user/user.entity';
import { Session } from 'models/session/session.entity';
import { PUBLIC_DIR, ANGULAR_DIR, VIEWS_DIR } from 'constants/locations';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('Craft Building Blocks')
    .setDescription('Buidling Blocks for apps built under Craft')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Handlebars View engine
  app.useStaticAssets(PUBLIC_DIR);
  app.useStaticAssets(ANGULAR_DIR);
  app.setBaseViewsDir(VIEWS_DIR);
  app.setViewEngine('hbs');

  setupSession(app);

  await app.listen(3000);
}

bootstrap();

function setupSession(app) {
  const configService = new ConfigService();
  const serverConfig = configService.getConfig('server');
  app.use(cookieParser(serverConfig.secretSession));

  const expires = new Date(
    new Date().getTime() +
      Number(serverConfig.expiryDays) * 24 * 60 * 60 * 1000, // 24 hrs * 60 min * 60 sec * 1000 ms
  );

  const cookie = {
    maxAge: Number(serverConfig.cookieMaxAge),
    httpOnly: false,
    secure: true,
    expires,
  };

  if (process.env.NODE_ENV !== 'production') cookie.secure = false;

  const sessionConfig = {
    name: serverConfig.sessionName,
    secret: serverConfig.secretSession,
    store: new TypeormStore({
      sessionService: getRepository(Session),
      userService: getRepository(User),
    }),
    cookie,
    saveUninitialized: false,
    resave: false,
    // unset: 'destroy'
  };

  app.use(expressSession(sessionConfig));
  app.use(passport.initialize());
  app.use(passport.session());
}
