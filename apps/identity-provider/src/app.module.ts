import { Module, HttpModule } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectTypeorm } from './constants/typeorm.connection';
import { AuthModule } from './auth/auth.module';
import { SystemSettingsModule } from './system-settings/system-settings.module';
import { ProfileManagementModule } from './profile-management/profile-management.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { TerminusOptionsService } from './system-settings/aggregates/terminus-options/terminus-options.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: connectTypeorm,
      inject: [ConfigService],
    }),
    TerminusModule.forRootAsync({ useClass: TerminusOptionsService }),
    ConfigModule,
    AuthModule,
    SystemSettingsModule,
    ProfileManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
