import {
  Module,
  HttpModule,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelsModule } from './models/models.module';
import { SetupController } from './controllers/setup/setup.controller';
import { SetupService } from './controllers/setup/setup.service';
import { TYPEORM_CONNECTION } from './models/typeorm.connection';
import { SettingsController } from './controllers/settings/settings.controller';
import { SettingsService } from './controllers/settings/settings.service';
import { ConnectController } from './controllers/connect/connect.controller';
import { INDEX_HTML } from './constants/filesystem';

@Module({
  imports: [
    TypeOrmModule.forRoot(TYPEORM_CONNECTION),
    ModelsModule,
    HttpModule,
  ],
  controllers: [
    AppController,
    SetupController,
    SettingsController,
    ConnectController,
  ],
  providers: [AppService, SetupService, SettingsService],
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
