// import './polyfills';

// import 'zone.js/dist/zone-node';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import * as passport from 'passport';
import { TypeormStore } from '../../../../libs/nestjs-session-store/dist';
import { ConfigService } from './config/config.service';
import { getRepository } from 'typeorm';
import { User } from './models/user/user.entity';
import { Session } from './models/session/session.entity';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { VIEWS_DIR } from './constants/locations';

const server = express();
server.use(express.static(join(process.cwd(), 'dist/identity-provider')));

// function appMiddleware(server) {
//   return (req, res, next) => {
//     // Serve static server only in production mode. In any other modes, treat this as a standalone API server.
//     if (process.env.NODE_ENV === 'production') {
//       server.use(express.static(join(process.cwd(), 'dist/identity-provider')));
//     }
//     next();
//   }
// }

// server.use(appMiddleware(server));

async function bootstrap() {
  const app = await NestFactory.create(AppModule, server);

  // const BROWSER_DIR = join(process.cwd(), 'dist', 'identity-provider');
  // app.useStaticAssets(BROWSER_DIR);

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('Craft Building Blocks')
    .setDescription('Buidling Blocks for apps built under Craft')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Handlebars View engine
  app.setBaseViewsDir(VIEWS_DIR);
  app.setViewEngine('hbs');

  setupSession(app);

  // app.use("/app/*",
  //   (req, res) => res.sendFile(
  //     join(process.cwd(), 'dist', 'identity-provider/index.html')));

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
