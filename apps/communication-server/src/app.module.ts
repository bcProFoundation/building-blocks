import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { SystemSettingsModule } from './system-settings/system-settings.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { Oauth2ClientModule } from './oauth2-client/oauth2-client.module';
import { connectTypeorm } from './constants/typeorm.connection';
import { CloudStorageModule } from './cloud-storage/cloud-storage.module';
import { ConfigService } from './config/config.service';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: connectTypeorm,
      inject: [ConfigService],
    }),
    ConfigModule,
    CommonModule,
    AuthModule,
    EmailModule,
    Oauth2ClientModule,
    SystemSettingsModule,
    CloudStorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
