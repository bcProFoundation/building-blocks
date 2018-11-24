import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { ServerSettings } from './server-settings/server-settings.entity';
import { ServerSettingsService } from './server-settings/server-settings.service';
import { TokenCache } from './token-cache/token-cache.entity';
import { TokenCacheService } from './token-cache/token-cache.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServerSettings, TokenCache]),
    ConfigModule,
  ],
  providers: [ServerSettingsService, TokenCacheService],
  exports: [ServerSettingsService, TokenCacheService],
})
export class ModelsModule {}
