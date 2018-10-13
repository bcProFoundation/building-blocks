import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { EmailAccount } from './email-account/email-account.entity';
import { EmailAccountService } from './email-account/email-account.service';
import { ServerSettingsService } from './server-settings/server-settings.service';
import { ServerSettings } from './server-settings/server-settings.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([EmailAccount, ServerSettings]),
  ],
  providers: [EmailAccountService, ServerSettingsService],
  exports: [EmailAccountService, ServerSettingsService],
})
export class ModelsModule {}
