import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ModelsModule } from './models/models.module';
import { TYPEORM_CONNECTION } from './models/typeorm.connection';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TYPEORM_CONNECTION),
    ModelsModule,
    SchedulerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
