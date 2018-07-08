import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ExpressSessionMiddleware } from '@nest-middlewares/express-session';
import { CookieParserMiddleware } from '@nest-middlewares/cookie-parser';
import {
  PassportInitializeMiddleware,
  PassportSessionMiddleware,
} from '@nest-middlewares/passport';
import { TypeormStore } from 'nestjs-session-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelsModule } from 'models/models.module';
import { ConfigModule } from 'config/config.module';
import { ConfigService } from 'config/config.service';

const config = new ConfigService();

@Module({
  imports: [
    TypeOrmModule.forRoot(config.getORMConfig()),
    AuthModule,
    ModelsModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
