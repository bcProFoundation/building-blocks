import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { EmailAccount } from './email-account/email-account.entity';
import { EmailAccountService } from './email-account/email-account.service';
import { ServerSettingsService } from './server-settings/server-settings.service';
import { ServerSettings } from './server-settings/server-settings.entity';
import { SocialKey } from './social-key/social-key.entity';
import { SocialKeyService } from './social-key/social-key.service';
import { TokenCache } from './token-cache/token-cache.entity';
import { QueueLogService } from './queue-log/queue-log.service';
import { QueueLog } from './queue-log/queue-log.entity';
import { TokenCacheService } from './token-cache/token-cache.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      EmailAccount,
      ServerSettings,
      SocialKey,
      TokenCache,
      QueueLog,
    ]),
  ],
  providers: [
    EmailAccountService,
    ServerSettingsService,
    SocialKeyService,
    QueueLogService,
    TokenCacheService,
  ],
  exports: [
    EmailAccountService,
    ServerSettingsService,
    SocialKeyService,
    QueueLogService,
    TokenCacheService,
  ],
})
export class ModelsModule {}
