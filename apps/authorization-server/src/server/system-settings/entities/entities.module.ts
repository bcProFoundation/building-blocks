import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SERVER_SETTINGS,
  ServerSettings,
} from './server-settings/server-settings.schema';
import { ServerSettingsService } from './server-settings/server-settings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SERVER_SETTINGS, schema: ServerSettings },
    ]),
    HttpModule,
  ],
  providers: [ServerSettingsService],
  exports: [ServerSettingsService],
})
export class SystemSettingsEntitiesModule {}
