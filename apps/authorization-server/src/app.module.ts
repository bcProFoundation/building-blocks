import { Module, HttpModule } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { CommonModule } from './common/common.module';
import { UserManagementModule } from './user-management/user-management.module';
import { ClientManagementModule } from './client-management/client-management.module';
import { SystemSettingsModule } from './system-settings/system-settings.module';
import { TerminusOptionsService } from './system-settings/aggregates/terminus-options/terminus-options.service';
import { EventStoreModule } from './event-store/event-store.module';

@Module({
  imports: [
    HttpModule,
    TerminusModule.forRootAsync({ useClass: TerminusOptionsService }),
    ConfigModule,
    CommonModule,
    AuthModule,
    UserManagementModule,
    ClientManagementModule,
    SystemSettingsModule,
    EventStoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
