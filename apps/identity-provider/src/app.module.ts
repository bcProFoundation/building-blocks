import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectTypeorm } from './constants/typeorm.connection';
import { AuthModule } from './auth/auth.module';
import { SystemSettingsModule } from './system-settings/system-settings.module';
import { ProfileManagementModule } from './profile-management/profile-management.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: connectTypeorm,
      inject: [ConfigService],
    }),
    ConfigModule,
    CommonModule,
    AuthModule,
    SystemSettingsModule,
    ProfileManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
