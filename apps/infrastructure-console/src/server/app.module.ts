import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelsModule } from './models/models.module';
import { SetupController } from './controllers/setup/setup.controller';
import { SetupService } from './controllers/setup/setup.service';
import { TYPEORM_CONNECTION } from './models/typeorm.connection';

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
