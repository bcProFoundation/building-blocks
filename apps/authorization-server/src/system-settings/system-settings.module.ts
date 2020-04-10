import { Module, Global } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { SystemSettingsEntitiesModule } from './entities/entities.module';
import { SetupService } from './controllers/setup/setup.service';
import { SetupController } from './controllers/setup/setup.controller';
import { ServerSettingsController } from './controllers/server-settings/server-settings.controller';
import { SystemSettingsManagementService } from './aggregates/system-settings-management/system-settings-management.service';
import { SystemSettingsCommandHandlers } from './commands';
import { SystemSettingsEventHandlers } from './events';
import { AuthEntitiesModule } from '../auth/entities/entities.module';
import { HealthController } from './controllers/health/health.controller';
import { HealthCheckAggregateService } from './aggregates/health-check/health-check.service';

@Global()
@Module({
  imports: [
    SystemSettingsEntitiesModule,
    AuthEntitiesModule,
    CqrsModule,
    TerminusModule,
  ],
  exports: [SystemSettingsEntitiesModule],
  providers: [
    SetupService,
    HealthCheckAggregateService,
    SystemSettingsManagementService,
    ...SystemSettingsCommandHandlers,
    ...SystemSettingsEventHandlers,
  ],
  controllers: [SetupController, ServerSettingsController, HealthController],
})
export class SystemSettingsModule {}
