import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import * as passport from 'passport';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { ConfigService } from './config/config.service';
import { join } from 'path';
import { INestApplication } from '@nestjs/common';
import * as connectMongoDBSession from 'connect-mongodb-session';
const MongoDBStore = connectMongoDBSession(expressSession);

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
    const mongoDBStore = new MongoDBStore({
      uri: `mongodb://${configService.get('DB_HOST')}/${configService.get(
        'DB_NAME',
      )}`,
      collection: 'session',
    });
    const sessionConfig = {
      name: configService.get('SESSION_NAME'),
      secret: configService.get('SESSION_SECRET'),
      store: mongoDBStore,
      cookie,
      saveUninitialized: false,
      resave: false,
      // unset: 'destroy'
    };

    app.use(expressSession(sessionConfig));
    app.use(passport.initialize());
    app.use(passport.session());
  }
}
