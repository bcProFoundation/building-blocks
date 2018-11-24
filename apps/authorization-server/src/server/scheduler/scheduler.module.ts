import { Module, Global } from '@nestjs/common';
import { ModelsModule } from '../models/models.module';
import { ConfigModule } from '../config/config.module';
import { schedulerProviders } from './scheduler-providers';

@Global()
@Module({
  imports: [ConfigModule, ModelsModule],
  providers: [...schedulerProviders],
  exports: [...schedulerProviders],
})
export class SchedulerModule {}
