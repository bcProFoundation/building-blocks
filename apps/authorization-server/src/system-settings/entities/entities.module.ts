import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServerSettingsService } from './server-settings/server-settings.service';
import { SystemSettingsModuleEntites } from './entities';

@Module({
  imports: [MongooseModule.forFeature(SystemSettingsModuleEntites), HttpModule],
  providers: [ServerSettingsService],
  exports: [
    ServerSettingsService,
    MongooseModule.forFeature(SystemSettingsModuleEntites),
  ],
})
export class SystemSettingsEntitiesModule {}
