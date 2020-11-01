import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as helmet from 'helmet';
import * as fs from 'fs';
import { join } from 'path';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MongoStore } from 'connect-mongo';
import { SessionOptions } from 'express-session';

import {
  ConfigService,
  SESSION_SECRET,
  COOKIE_MAX_AGE,
  SESSION_NAME,
  NODE_ENV,
} from './config/config.service';
import { i18n } from './i18n/i18n.config';
import { VIEWS_DIR, SWAGGER_ROUTE } from './constants/app-strings';
import { SESSION_CONNECTION } from './common/database.provider';

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
  }

  setupSession(app: INestApplication) {
    this.server.use(cookieParser(this.config.get(SESSION_SECRET)));

    const cookie = {
      maxAge: Number(this.config.get(COOKIE_MAX_AGE)),
      httpOnly: false,
      secure: true,
    };

    if (this.config.get(NODE_ENV) !== 'production') {
      cookie.secure = false;
    }

    const { store, expressSession } = app.get<{
      store: MongoStore;
      expressSession: (options?: SessionOptions) => express.RequestHandler;
    }>(SESSION_CONNECTION);

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
