import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPEORM_CONNECTION } from './constants/typeorm.connection';
import { SystemSettingsModule } from './system-settings/system-settings.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ServiceManagementModule } from './service-management/service-management.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot(TYPEORM_CONNECTION),
    ConfigModule,
    AuthModule,
    SystemSettingsModule,
    ServiceManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
