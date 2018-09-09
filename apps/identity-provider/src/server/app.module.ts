import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModelsModule } from './models/models.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPEORM_CONNECTION } from './models/typeorm.connection';
import { SettingsService } from 'controllers/settings/settings.service';
import { SettingsController } from 'controllers/settings/settings.controller';

@Module({
  imports: [TypeOrmModule.forRoot(TYPEORM_CONNECTION), ModelsModule],
  controllers: [AppController, SettingsController],
  providers: [AppService, SettingsService],
})
export class AppModule {}
