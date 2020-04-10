import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { SystemSettingsModule } from './system-settings/system-settings.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { Oauth2ClientModule } from './oauth2-client/oauth2-client.module';
import { SmsmessageModule } from './smsmessage/smsmessage.module';
import { connectTypeorm } from './constants/typeorm.connection';
import { CloudStorageModule } from './cloud-storage/cloud-storage.module';
import { ConfigService } from './config/config.service';
import { EventStoreModule } from './event-store/event-store.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: connectTypeorm,
      inject: [ConfigService],
    }),
    ConfigModule,
    AuthModule,
    EmailModule,
    Oauth2ClientModule,
    SmsmessageModule,
    SystemSettingsModule,
    CloudStorageModule,
    EventStoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
