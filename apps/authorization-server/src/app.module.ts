import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { CommonModule } from './common/common.module';
import { UserManagementModule } from './user-management/user-management.module';
import { ClientManagementModule } from './client-management/client-management.module';
import { SystemSettingsModule } from './system-settings/system-settings.module';

@Module({
  imports: [
    ConfigModule,
    CommonModule,
    AuthModule,
    UserManagementModule,
    ClientManagementModule,
    SystemSettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
