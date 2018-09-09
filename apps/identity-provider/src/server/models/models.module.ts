import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { IdentityProviderSettings } from './identity-provider-settings/identity-provider-settings.entity';
import { IdentityProviderSettingsService } from './identity-provider-settings/identity-provider-settings.service';
import { Profile } from './profile/profile.entity';
import { ProfileService } from './profile/profile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([IdentityProviderSettings, Profile]),
    ConfigModule,
  ],
  providers: [IdentityProviderSettingsService, ProfileService],
  exports: [IdentityProviderSettingsService, ProfileService],
})
export class ModelsModule {}
