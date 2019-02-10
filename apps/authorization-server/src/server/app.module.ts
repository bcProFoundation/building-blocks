import {
  Module,
  HttpModule,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { CommonModule } from './common/common.module';
import { ConfigService } from './config/config.service';
import { UserManagementModule } from './user-management/user-management.module';
import { ClientManagementModule } from './client-management/client-management.module';
import { SystemSettingsModule } from './system-settings/system-settings.module';
import { INDEX_HTML } from './constants/app-strings';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const uri = `mongodb://${config.get('DB_USER')}:${config.get(
          'DB_PASSWORD',
        )}@${config.get('DB_HOST')}/${config.get('DB_NAME')}`;
        return {
          uri,
          useNewUrlParser: true,
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule,
    CommonModule,
    AuthModule,
    UserManagementModule,
    ClientManagementModule,
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
      .forRoutes('/forgot*');
  }
}
