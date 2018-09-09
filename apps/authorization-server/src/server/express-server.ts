import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import * as passport from 'passport';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import { ConfigService } from './config/config.service';
import { getRepository } from 'typeorm';
import { User } from './models/user/user.entity';
import { Session } from './models/session/session.entity';
import { TypeormStore } from './auth/passport/typeorm-session.store';
import { join } from 'path';
import { INestApplication } from '@nestjs/common';
import { Client } from './models/client/client.entity';

export class ExpressServer {
  public server: express.Express;

  constructor() {
    this.server = express();
  }

  setupSecurity() {
    // Helmet
    this.server.use(helmet());

    // Rate-limit
    this.server.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
      }),
    );
  }

  setupAssetDir() {
    this.server.use(
      express.static(join(process.cwd(), 'dist/authorization-server')),
    );
  }

  setupSession(app: INestApplication) {
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

  async setupCORS(app?: INestApplication) {
    const clients = await getRepository(Client).find({
      select: ['redirectUris'],
    });
    const redirectUris: string[] = [];

    /**
     * TODO: Loop unnecessary if select works
     * https://github.com/typeorm/typeorm/pull/2605
     */
    for (const client of clients) {
      redirectUris.push(...client.redirectUris);
    }

    const allowedOrigins = redirectUris.map(r => {
      const url = new URL(r);
      return url.origin;
    });

    app.enableCors({
      origin: allowedOrigins,
    });
  }

  setupCsurf(app: INestApplication) {
    // CSRF
    app.use(csurf());
  }
}
