import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModelsModule } from './models/models.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPEORM_CONNECTION } from './models/typeorm.connection';
import { SetupService } from './controllers/setup/setup.service';
import { SetupController } from './controllers/setup/setup.controller';
import { ProfileController } from './controllers/profile/profile.controller';
import { SettingsController } from './controllers/settings/settings.controller';
import { ConnectController } from './controllers/connect/connect.controller';
import { SettingsService } from './controllers/settings/settings.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(TYPEORM_CONNECTION),
    ModelsModule,
    HttpModule,
  ],
  controllers: [
    AppController,
    SetupController,
    ProfileController,
    SettingsController,
    ConnectController,
  ],
  providers: [AppService, SetupService, SettingsService],
})
export class AppModule {}
