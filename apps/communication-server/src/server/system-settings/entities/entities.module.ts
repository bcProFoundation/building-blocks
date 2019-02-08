import { Module } from '@nestjs/common';
import { ServerSettingsService } from './server-settings/server-settings.service';
import { QueueLogService } from './queue-log/queue-log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerSettings } from './server-settings/server-settings.entity';
import { QueueLog } from './queue-log/queue-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServerSettings, QueueLog])],
  providers: [ServerSettingsService, QueueLogService],
  exports: [ServerSettingsService, QueueLogService],
})
export class SystemSettingsEntitiesModule {}
