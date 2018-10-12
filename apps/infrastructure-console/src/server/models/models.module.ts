import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { ServerSettings } from './server-settings/server-settings.entity';
import { ServerSettingsService } from './server-settings/server-settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServerSettings]), ConfigModule],
  providers: [ServerSettingsService],
  exports: [ServerSettingsService],
})
export class ModelsModule {}
