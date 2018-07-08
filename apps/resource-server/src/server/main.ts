import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import * as passport from 'passport';
import { TypeormStore } from 'nestjs-session-store';
import { ConfigService } from 'config/config.service';
import { getRepository } from 'typeorm';
import { User } from 'models/user/user.entity';
import { Session } from 'models/session/session.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Handlebars View engine
  app.useStaticAssets(__dirname + '/public');
  app.useStaticAssets(join(__dirname, '..', '..', '/dist/spa-mat'));
  app.setBaseViewsDir(__dirname + '/views');
  app.setViewEngine('hbs');

  setupSession(app);

  await app.listen(4000);
}
bootstrap();

function setupSession(app) {
  const configService = new ConfigService();
  app.use(cookieParser(configService.get('SESSION_SECRET')));

  const expires = new Date(
    new Date().getTime() +
      Number(configService.get('EXPIRE_DAYS')) * 24 * 60 * 60 * 1000, // 24 hrs * 60 min * 60 sec * 1000 ms
  );

  const cookie = {
    maxAge: Number(configService.get('COOKIE_MAX_AGE')),
    httpOnly: false,
    secure: true,
    expires,
  };

  if (process.env.NODE_ENV !== 'production') cookie.secure = false;

  const sessionConfig = {
    name: 'idp_session',
    secret: configService.get('SESSION_SECRET'),
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
