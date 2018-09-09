import { Module } from '@nestjs/common';
import { TokenSchedulerService } from './token-schedule.service';
import { ModelsModule } from '../models/models.module';
import { ConfigModule } from '../config/config.module';
import { AgendaService } from './agenda.service';

@Module({
  imports: [ConfigModule, ModelsModule],
  providers: [TokenSchedulerService, AgendaService],
})
export class SchedulerModule {}
