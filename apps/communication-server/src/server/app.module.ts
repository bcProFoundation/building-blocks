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
import { TYPEORM_CONNECTION } from './constants/typeorm.connection';
import { CloudStorageModule } from './cloud-storage/cloud-storage.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TYPEORM_CONNECTION),
    ConfigModule,
    AuthModule,
    EmailModule,
    Oauth2ClientModule,
    SmsmessageModule,
    SystemSettingsModule,
    CloudStorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
