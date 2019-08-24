import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
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
import { TerminusOptionsService } from './system-settings/aggregates/terminus-options/terminus-options.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: connectTypeorm,
      inject: [ConfigService],
    }),
    TerminusModule.forRootAsync({ useClass: TerminusOptionsService }),
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
