import { Module, Global } from '@nestjs/common';
import { SystemSettingsEntitiesModule } from './entities/system-entities.module';
import { SettingsController } from './controllers/settings/settings.controller';
import { SetupController } from './controllers/setup/setup.controller';
import { ConnectController } from './controllers/connect/connect.controller';
import { SettingsService } from './controllers/settings/settings.service';
import { SetupService } from './controllers/setup/setup.service';

@Global()
@Module({
  imports: [SystemSettingsEntitiesModule],
  providers: [SettingsService, SetupService],
  controllers: [SettingsController, SetupController, ConnectController],
  exports: [SystemSettingsEntitiesModule, SettingsService, SetupService],
})
export class SystemSettingsModule {}
