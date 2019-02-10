import { Module, Global } from '@nestjs/common';
import { SystemSettingsEntitiesModule } from './entities/entities.module';
import { SetupService } from './controllers/setup/setup.service';
import { SetupController } from './controllers/setup/setup.controller';
import { ServerSettingsController } from './controllers/server-settings/server-settings.controller';

@Global()
@Module({
  imports: [SystemSettingsEntitiesModule],
  exports: [SystemSettingsEntitiesModule],
  providers: [SetupService],
  controllers: [SetupController, ServerSettingsController],
})
export class SystemSettingsModule {}
