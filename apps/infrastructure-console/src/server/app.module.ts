import {
  Module,
  HttpModule,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPEORM_CONNECTION } from './constants/typeorm.connection';
import { INDEX_HTML } from './constants/filesystem';
import { SystemSettingsModule } from './system-settings/system-settings.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot(TYPEORM_CONNECTION),
    ConfigModule,
    AuthModule,
    SystemSettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        res.sendFile(INDEX_HTML);
      })
      .forRoutes('/social_login*', '/client*', '/user*', '/role*', '/scope*');
  }
}
