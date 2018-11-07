import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { EmailAccount } from './email-account/email-account.entity';
import { EmailAccountService } from './email-account/email-account.service';
import { ServerSettingsService } from './server-settings/server-settings.service';
import { ServerSettings } from './server-settings/server-settings.entity';
import { SocialKey } from './social-key/social-key.entity';
import { SocialKeyService } from './social-key/social-key.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([EmailAccount, ServerSettings, SocialKey]),
  ],
  providers: [EmailAccountService, ServerSettingsService, SocialKeyService],
  exports: [EmailAccountService, ServerSettingsService, SocialKeyService],
})
export class ModelsModule {}
