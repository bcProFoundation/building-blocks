import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { ServerSettings } from './server-settings/server-settings.entity';
import { ServerSettingsService } from './server-settings/server-settings.service';
import { Profile } from './profile/profile.entity';
import { ProfileService } from './profile/profile.service';
import { TokenCache } from './token-cache/token-cache.entity';
import { TokenCacheService } from './token-cache/token-cache.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServerSettings, Profile, TokenCache]),
    ConfigModule,
  ],
  providers: [ServerSettingsService, ProfileService, TokenCacheService],
  exports: [ServerSettingsService, ProfileService, TokenCacheService],
})
export class ModelsModule {}
