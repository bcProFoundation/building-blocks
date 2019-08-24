import { Module, Global, HttpModule } from '@nestjs/common';
import { SystemSettingsEntitiesModule } from './entities/entities.module';
import { SettingsController } from './controllers/settings/settings.controller';
import { SetupController } from './controllers/setup/setup.controller';
import { SettingsService } from './aggregates/settings/settings.service';
import { SetupService } from './aggregates/setup/setup.service';

@Global()
@Module({
  imports: [SystemSettingsEntitiesModule, HttpModule],
  controllers: [SettingsController, SetupController],
  providers: [SettingsService, SetupService],
  exports: [SystemSettingsEntitiesModule, SetupService],
})
export class SystemSettingsModule {}
