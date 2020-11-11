import { Module, Global, HttpModule } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { SystemSettingsEntitiesModule } from './entities/entities.module';
import { SettingsController } from './controllers/settings/settings.controller';
import { SetupController } from './controllers/setup/setup.controller';
import { SettingsService } from './aggregates/settings/settings.service';
import { SetupService } from './aggregates/setup/setup.service';
import { HealthCheckAggregateService } from './aggregates/health-check/health-check.service';
import { HealthController } from './controllers/health/health.controller';
import { DatabaseHealthIndicatorService } from './aggregates/database-health-indicator/database-health-indicator.service';

@Global()
@Module({
  imports: [SystemSettingsEntitiesModule, HttpModule, TerminusModule],
  controllers: [SettingsController, SetupController, HealthController],
  providers: [
    SettingsService,
    SetupService,
    HealthCheckAggregateService,
    DatabaseHealthIndicatorService,
  ],
  exports: [SystemSettingsEntitiesModule, SetupService],
})
export class SystemSettingsModule {}
