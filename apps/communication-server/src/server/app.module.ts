import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModelsModule } from './models/models.module';
import { TYPEORM_CONNECTION } from './models/typeorm.connection';
import { SetupController } from './controllers/setup/setup.controller';
import { SetupService } from './controllers/setup/setup.service';
import { EmailService } from './controllers/email/email.service';
import { EmailController } from './controllers/email/email.controller';
import { ConfigModule } from './config/config.module';
import { ServerSettingsService } from './models/server-settings/server-settings.service';
import { SocialKeyService } from './models/social-key/social-key.service';
import { MicroservicePatternController } from './controllers/microservice/pattern.controller';
import { MicroservicePatternService } from './controllers/microservice/pattern.service';
import { AuthServerVerificationGuard } from './guards/authserver-verification.guard';
import { SettingsController } from './controllers/settings/settings.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot(TYPEORM_CONNECTION),
    ModelsModule,
    HttpModule,
  ],
  controllers: [
    AppController,
    SetupController,
    EmailController,
    SettingsController,
    MicroservicePatternController,
  ],
  providers: [
    AppService,
    SetupService,
    EmailService,
    ServerSettingsService,
    SocialKeyService,
    MicroservicePatternService,
    AuthServerVerificationGuard,
  ],
})
export class AppModule {}
