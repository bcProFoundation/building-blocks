import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ModelsModule } from './models/models.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { MONGOOSE_CONNECTION } from './models/mongoose.connection';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${MONGOOSE_CONNECTION.host}/${MONGOOSE_CONNECTION.database}`,
      { useNewUrlParser: true },
    ),
    ModelsModule,
    SchedulerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
