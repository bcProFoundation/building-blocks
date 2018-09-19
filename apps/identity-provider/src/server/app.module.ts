import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModelsModule } from './models/models.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPEORM_CONNECTION } from './models/typeorm.connection';
import { SetupService } from './controllers/setup/setup.service';
import { SetupController } from './controllers/setup/setup.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(TYPEORM_CONNECTION),
    ModelsModule,
    HttpModule,
  ],
  controllers: [AppController, SetupController],
  providers: [AppService, SetupService],
})
export class AppModule {}
