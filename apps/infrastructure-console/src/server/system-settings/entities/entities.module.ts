import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerSettingsService } from './server-settings/server-settings.service';
import { ServerSettings } from './server-settings/server-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServerSettings])],
  providers: [ServerSettingsService],
  exports: [ServerSettingsService],
})
export class SystemSettingsEntitiesModule {}
