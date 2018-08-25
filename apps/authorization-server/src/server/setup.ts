import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import * as passport from 'passport';
import { ConfigService } from './config/config.service';
import { getRepository } from 'typeorm';
import { User } from './models/user/user.entity';
import { Session } from './models/session/session.entity';
import { TypeormStore } from './auth/passport/typeorm-session.store';

export function setupSession(app) {
  const configService = new ConfigService();
  app.use(cookieParser(configService.get('SESSION_SECRET')));

  const expires = new Date(
    new Date().getTime() +
      Number(configService.get('EXPIRY_DAYS')) * 24 * 60 * 60 * 1000, // 24 hrs * 60 min * 60 sec * 1000 ms
  );

  const cookie = {
    maxAge: Number(configService.get('COOKIE_MAX_AGE')),
    httpOnly: false,
    secure: true,
    expires,
  };

  if (process.env.NODE_ENV !== 'production') cookie.secure = false;

  const sessionConfig = {
    name: configService.get('SESSION_NAME'),
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
