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
import { ServerSideRenderingMiddleware } from 'auth/middlewares/server-side-rendering.middleware';
import { OAuth2Controller } from 'auth/controllers/oauth2/oauth2.controller';

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
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ServerSideRenderingMiddleware).forRoutes(AppController);
  }
}
