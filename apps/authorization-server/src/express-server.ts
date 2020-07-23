import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import * as passport from 'passport';
import * as helmet from 'helmet';
import * as connectMongoDBSession from 'connect-mongo';
import * as fs from 'fs';
import { join } from 'path';
import { stringify } from 'querystring';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  ConfigService,
  SESSION_SECRET,
  COOKIE_MAX_AGE,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME,
  SESSION_NAME,
  NODE_ENV,
  MONGO_URI_PREFIX,
} from './config/config.service';
import { i18n } from './i18n/i18n.config';
import { VIEWS_DIR, SWAGGER_ROUTE } from './constants/app-strings';
import { SESSION_COLLECTION } from './auth/entities/session/session.schema';
import { MAJORITY } from './common/database.provider';

// import * as rateLimit from 'express-rate-limit';

const MongoStore = connectMongoDBSession(expressSession);

export class ExpressServer {
  public server: express.Express;

  constructor(private config: ConfigService) {
    this.server = express();
  }

  setupSecurity() {
    // Helmet
    this.server.use(helmet());

    // Enable Trust Proxy for session to work
    // https://github.com/expressjs/session/issues/281
    this.server.set('trust proxy', 1);

    // Rate-limit
    // TODO: Multiple Services need to ping Auth Server
    // this.server.use(
    //   rateLimit({
    //     windowMs: 15 * 60 * 1000, // 15 minutes
    //     max: 1000, // limit each IP to 100 requests per windowMs
    //   }),
    // );
  }

  setupSession() {
    this.server.use(cookieParser(this.config.get(SESSION_SECRET)));

    const cookie = {
      maxAge: Number(this.config.get(COOKIE_MAX_AGE)),
      httpOnly: false,
      secure: true,
    };

    if (this.config.get(NODE_ENV) !== 'production') {
      cookie.secure = false;
    }

    const url = this.getMongoUrl();

    const store = new MongoStore({
      url,
      touchAfter: 24 * 3600, // 24 hours * 3600 secs
      collection: SESSION_COLLECTION,
      stringify: false,
    });
    const sessionConfig = {
      name: this.config.get(SESSION_NAME),
      secret: this.config.get(SESSION_SECRET),
      store,
      cookie,
      saveUninitialized: false,
      resave: false,
      proxy: true, // https://github.com/expressjs/session/issues/281
      // unset: 'destroy'
    };

    this.server.use(expressSession(sessionConfig));
    this.server.use(passport.initialize());
    this.server.use(passport.session());
  }

  setupI18n() {
    this.server.use(i18n.init);
  }

  getMongoUrl() {
    const mongoUriPrefix = this.config.get(MONGO_URI_PREFIX) || 'mongodb';
    const mongoOptions = this.getMongoOptions();

    return `${mongoUriPrefix}://${this.config.get(DB_USER)}:${this.config.get(
      DB_PASSWORD,
    )}@${this.config.get(DB_HOST)}/${this.config.get(DB_NAME)}?${mongoOptions}`;
  }

  getMongoOptions() {
    return stringify({
      useUnifiedTopology: true,
      w: MAJORITY,
      retryWrites: true,
      useNewUrlParser: true,
    });
  }

  static setupSwagger(app) {
    const version = JSON.parse(
      fs.readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
    ).version;
    const options = new DocumentBuilder()
      .setTitle(i18n.__('Authorization Server'))
      .setDescription(i18n.__('OAuth 2.0 OpenID Connect Authorization Server'))
      .setVersion(version)
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(SWAGGER_ROUTE, app, document);
  }

  static setupViewEngine(app: INestApplication) {
    app.getHttpAdapter().setBaseViewsDir(VIEWS_DIR);
    app.getHttpAdapter().setViewEngine('hbs');
  }
}
