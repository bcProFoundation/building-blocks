import { Module, HttpModule } from '@nestjs/common';
import { ServerSettingsService } from './server-settings/server-settings.service';
import { SystemSettingsModuleEntities } from './entities';

@Module({
  imports: [HttpModule],
  providers: [...SystemSettingsModuleEntities, ServerSettingsService],
  exports: [ServerSettingsService, ...SystemSettingsModuleEntities],
})
export class SystemSettingsEntitiesModule {}
