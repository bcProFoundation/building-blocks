import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { IdentityProviderSettings } from './identity-provider-settings/identity-provider-settings.entity';
import { IdentityProviderSettingsService } from './identity-provider-settings/identity-provider-settings.service';
import { Profile } from './profile/profile.entity';
import { ProfileService } from './profile/profile.service';
import { TokenCache } from './token-cache/token-cache.entity';
import { TokenCacheService } from './token-cache/token-cache.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([IdentityProviderSettings, Profile, TokenCache]),
    ConfigModule,
  ],
  providers: [
    IdentityProviderSettingsService,
    ProfileService,
    TokenCacheService,
  ],
  exports: [IdentityProviderSettingsService, ProfileService, TokenCacheService],
})
export class ModelsModule {}
