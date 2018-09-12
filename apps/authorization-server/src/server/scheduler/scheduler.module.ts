import { Module } from '@nestjs/common';
import { TokenSchedulerService } from './token-schedule.service';
import { ModelsModule } from '../models/models.module';
import { ConfigModule } from '../config/config.module';
import { AgendaService, MockAgendaService } from './agenda.service';

const AgendaProvider = {
  provide: AgendaService,
  useClass: ['test', 'test-e2e'].includes(process.env.NODE_ENV)
    ? MockAgendaService
    : AgendaService,
};

@Module({
  imports: [ConfigModule, ModelsModule],
  providers: [TokenSchedulerService, AgendaProvider],
})
export class SchedulerModule {}
