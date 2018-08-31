import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot(TYPEORM_CONNECTION),
    ModelsModule,
  ],
  controllers: [AppController, SetupController, EmailController],
  providers: [AppService, SetupService, EmailService],
})
export class AppModule {}
