import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { CommonModule } from './common/common.module';
import {
  ConfigService,
  DB_USER,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
} from './config/config.service';
import { UserManagementModule } from './user-management/user-management.module';
import { ClientManagementModule } from './client-management/client-management.module';
import { SystemSettingsModule } from './system-settings/system-settings.module';
import { TerminusOptionsService } from './system-settings/aggregates/terminus-options/terminus-options.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const uri = `mongodb://${config.get(DB_USER)}:${config.get(
          DB_PASSWORD,
        )}@${config.get(DB_HOST)}/${config.get(DB_NAME)}`;
        return {
          uri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
      inject: [ConfigService],
    }),
    TerminusModule.forRootAsync({ useClass: TerminusOptionsService }),
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
export class AppModule {}
