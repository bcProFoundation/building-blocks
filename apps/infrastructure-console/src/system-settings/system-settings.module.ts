import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';
import { SystemSettingsEntitiesModule } from './entities/entities.module';
import { SettingsService } from './aggregates/settings/settings.service';
import { SetupService } from './aggregates/setup/setup.service';
import { ConnectController } from './controllers/connect/connect.controller';
import { SettingsController } from './controllers/settings/settings.controller';
import { SetupController } from './controllers/setup/setup.controller';
import { HealthCheckAggregateService } from './aggregates/health-check/health-check.service';
import { HealthController } from './controllers/health/health.controller';
import { DatabaseHealthIndicatorService } from './aggregates/database-health-indicator/database-health-indicator.service';

@Global()
@Module({
  imports: [SystemSettingsEntitiesModule, HttpModule, TerminusModule],
  providers: [
    SettingsService,
    SetupService,
    HealthCheckAggregateService,
    DatabaseHealthIndicatorService,
  ],
  controllers: [
    ConnectController,
    SettingsController,
    SetupController,
    HealthController,
  ],
  exports: [SystemSettingsEntitiesModule, SettingsService, SetupService],
})
export class SystemSettingsModule {}
