import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerSettings } from './server-settings/server-settings.entity';
import { ServerSettingsService } from './server-settings/server-settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServerSettings])],
  providers: [ServerSettingsService],
  exports: [ServerSettingsService],
})
export class SystemSettingsEntitiesModule {}
