import { Module, Global, HttpModule } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { SystemSettingsEntitiesModule } from './entities/entities.module';
import { SettingsService } from './aggregates/settings/settings.service';
import { SetupService } from './aggregates/setup/setup.service';
import { ConnectController } from './controllers/connect/connect.controller';
import { SettingsController } from './controllers/settings/settings.controller';
import { SetupController } from './controllers/setup/setup.controller';
import { HealthCheckAggregateService } from './aggregates/health-check/health-check.service';
import { HealthController } from './controllers/health/health.controller';

@Global()
@Module({
  imports: [SystemSettingsEntitiesModule, HttpModule, TerminusModule],
  providers: [SettingsService, SetupService, HealthCheckAggregateService],
  controllers: [
    ConnectController,
    SettingsController,
    SetupController,
    HealthController,
  ],
  exports: [SystemSettingsEntitiesModule, SettingsService, SetupService],
})
export class SystemSettingsModule {}
