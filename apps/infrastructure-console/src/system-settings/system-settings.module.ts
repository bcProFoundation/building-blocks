import { Module, Global, HttpModule } from '@nestjs/common';
import { SystemSettingsEntitiesModule } from './entities/entities.module';
import { SettingsService } from './aggregates/settings/settings.service';
import { SetupService } from './aggregates/setup/setup.service';
import { ConnectController } from './controllers/connect/connect.controller';
import { SettingsController } from './controllers/settings/settings.controller';
import { SetupController } from './controllers/setup/setup.controller';

@Global()
@Module({
  imports: [SystemSettingsEntitiesModule, HttpModule],
  providers: [SettingsService, SetupService],
  controllers: [ConnectController, SettingsController, SetupController],
  exports: [SystemSettingsEntitiesModule, SettingsService, SetupService],
})
export class SystemSettingsModule {}
