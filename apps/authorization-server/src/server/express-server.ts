import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import * as passport from 'passport';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { ConfigService } from './config/config.service';
import { join } from 'path';
import { INestApplication } from '@nestjs/common';
import * as connectMongoDBSession from 'connect-mongo';
const MongoStore = connectMongoDBSession(expressSession);

export class ExpressServer {
  public server: express.Express;

  constructor(private configService: ConfigService) {
    this.server = express();
  }

  setupSecurity() {
    // Helmet
    this.server.use(helmet());

    // Rate-limit
    this.server.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000, // limit each IP to 100 requests per windowMs
      }),
    );
  }

  setupAssetDir() {
    this.server.use(
      express.static(join(process.cwd(), 'dist/authorization-server')),
    );
  }

  setupSession(app: INestApplication) {
    app.use(cookieParser(this.configService.get('SESSION_SECRET')));

    const expires = new Date(
      new Date().getTime() +
        Number(this.configService.get('EXPIRY_DAYS')) * 24 * 60 * 60 * 1000, // 24 hrs * 60 min * 60 sec * 1000 ms
    );

    const cookie = {
      maxAge: Number(this.configService.get('COOKIE_MAX_AGE')),
      httpOnly: false,
      secure: true,
      expires,
    };

    if (process.env.NODE_ENV !== 'production') cookie.secure = false;
    const store = new MongoStore({
      url: `mongodb://${this.configService.get(
        'DB_HOST',
      )}/${this.configService.get('DB_NAME')}`,
      touchAfter: 24 * 3600, // 24 hours * 3600 secs
      collection: 'session',
    });
    const sessionConfig = {
      name: this.configService.get('SESSION_NAME'),
      secret: this.configService.get('SESSION_SECRET'),
      store,
      cookie,
      saveUninitialized: false,
      resave: false,
      proxy: true, // https://github.com/expressjs/session/issues/281
      // unset: 'destroy'
    };

    app.use(expressSession(sessionConfig));
    app.use(passport.initialize());
    app.use(passport.session());
  }
}
