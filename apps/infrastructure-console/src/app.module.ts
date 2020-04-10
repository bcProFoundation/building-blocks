import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { connectTypeorm } from './constants/typeorm.connection';
import { SystemSettingsModule } from './system-settings/system-settings.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ServiceManagementModule } from './service-management/service-management.module';
import { OrganizationSettingsModule } from './organization-settings/organization-settings.module';
import { ConfigService } from './config/config.service';
import { EventStoreModule } from './event-store/event-store.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: connectTypeorm,
      inject: [ConfigService],
    }),
    ConfigModule,
    AuthModule,
    SystemSettingsModule,
    ServiceManagementModule,
    OrganizationSettingsModule,
    EventStoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
