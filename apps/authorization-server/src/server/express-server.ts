import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import * as passport from 'passport';
import * as helmet from 'helmet';
import * as connectMongoDBSession from 'connect-mongo';
import { ConfigService } from './config/config.service';
import { join } from 'path';
import { INestApplication } from '@nestjs/common';
import { i18n } from './i18n/i18n.config';
import * as fs from 'fs';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VIEWS_DIR } from './constants/app-strings';

// import * as rateLimit from 'express-rate-limit';

const MongoStore = connectMongoDBSession(expressSession);

export class ExpressServer {
  public server: express.Express;

  constructor(private configService: ConfigService) {
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

  setupAssetDir() {
    this.server.use(
      express.static(join(process.cwd(), 'dist/authorization-server')),
    );
  }

  setupSession() {
    this.server.use(cookieParser(this.configService.get('SESSION_SECRET')));

    const cookie = {
      maxAge: Number(this.configService.get('COOKIE_MAX_AGE')),
      httpOnly: false,
      secure: true,
    };

    if (process.env.NODE_ENV !== 'production') cookie.secure = false;
    const url = `mongodb://${this.configService.get(
      'DB_USER',
    )}:${this.configService.get('DB_PASSWORD')}@${this.configService.get(
      'DB_HOST',
    )}/${this.configService.get('DB_NAME')}`;

    const store = new MongoStore({
      url,
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
    SwaggerModule.setup('api', app, document);
  }

  static setupViewEngine(app: INestApplication) {
    app.getHttpAdapter().setBaseViewsDir(VIEWS_DIR);
    app.getHttpAdapter().setViewEngine('hbs');
  }
}
