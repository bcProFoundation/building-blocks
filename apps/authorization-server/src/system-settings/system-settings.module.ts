import { Module, Global, HttpModule } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SystemSettingsEntitiesModule } from './entities/entities.module';
import { SetupService } from './controllers/setup/setup.service';
import { SetupController } from './controllers/setup/setup.controller';
import { ServerSettingsController } from './controllers/server-settings/server-settings.controller';
import { SystemSettingsManagementService } from './aggregates/system-settings-management/system-settings-management.service';
import { SystemSettingsCommandHandlers } from './commands';
import { SystemSettingsEventHandlers } from './events';
import { AuthEntitiesModule } from '../auth/entities/entities.module';

@Global()
@Module({
  imports: [
    SystemSettingsEntitiesModule,
    AuthEntitiesModule,
    CqrsModule,
    HttpModule,
  ],
  exports: [SystemSettingsEntitiesModule],
  providers: [
    SetupService,
    SystemSettingsManagementService,
    ...SystemSettingsCommandHandlers,
    ...SystemSettingsEventHandlers,
  ],
  controllers: [SetupController, ServerSettingsController],
})
export class SystemSettingsModule {}
