import { Module, Global, HttpModule } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SystemSettingsEntitiesModule } from './entities/system-entities.module';
import { SettingsController } from './controllers/settings/settings.controller';
import { SetupController } from './controllers/setup/setup.controller';
import { ConnectController } from './controllers/connect/connect.controller';
import { SettingsService } from './controllers/settings/settings.service';
import { SetupService } from './controllers/setup/setup.service';
import { ConnectService } from './controllers/connect/connect.service';

@Global()
@Module({
  imports: [SystemSettingsEntitiesModule, HttpModule, CqrsModule],
  providers: [SettingsService, SetupService, ConnectService],
  controllers: [SettingsController, SetupController, ConnectController],
  exports: [SystemSettingsEntitiesModule, SettingsService, SetupService],
})
export class SystemSettingsModule {}
