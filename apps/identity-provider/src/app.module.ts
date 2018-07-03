import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ModelsModule } from './models/models.module';
import { ExpressSessionMiddleware } from '@nest-middlewares/express-session';
import { CookieParserMiddleware } from '@nest-middlewares/cookie-parser';
import {
  PassportInitializeMiddleware,
  PassportSessionMiddleware,
} from '@nest-middlewares/passport';
import { TypeormStore } from 'nestjs-session-store';
import { SessionService } from 'models/session/session.service';
import { UserService } from 'models/user/user.service';
import { ConfigModule } from 'config/config.module';
import { ConfigService } from 'config/config.service';

const config = new ConfigService();

@Module({
  imports: [
    TypeOrmModule.forRoot(config.getORMConfig()),
    ConfigModule,
    ModelsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    this.configureMiddlewares();
    consumer
      .apply(CookieParserMiddleware)
      .forRoutes(AppController)
      .apply(ExpressSessionMiddleware)
      .forRoutes(AppController)
      .apply(PassportInitializeMiddleware)
      .forRoutes(AppController)
      .apply(PassportSessionMiddleware)
      .forRoutes(AppController);
  }

  configureMiddlewares() {
    CookieParserMiddleware.configure(this.configService.get('SESSION_SECRET'));

    const expires = new Date(
      new Date().getTime() +
        Number(this.configService.get('EXPIRE_DAYS')) * 24 * 60 * 60 * 1000, // 24 hrs * 60 min * 60 sec * 1000 ms
    );

    const cookie = {
      maxAge: Number(this.configService.get('COOKIE_MAX_AGE')),
      httpOnly: false,
      secure: true,
      expires,
    };

    if (process.env.NODE_ENV !== 'production') cookie.secure = false;

    const sessionConfig = {
      name: 'idp_session',
      secret: this.configService.get('SESSION_SECRET'),
      store: new TypeormStore({
        sessionService: this.sessionService,
        userService: this.userService,
      }),
      cookie,
      saveUninitialized: false,
      resave: false,
      // unset: 'destroy'
    };

    ExpressSessionMiddleware.configure(sessionConfig);
  }
}
