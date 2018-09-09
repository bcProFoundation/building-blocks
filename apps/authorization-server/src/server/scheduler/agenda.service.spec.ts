import { Test, TestingModule } from '@nestjs/testing';
import { AgendaService } from './agenda.service';
import { TokenSchedulerService } from './token-schedule.service';
import { ConfigService } from '../config/config.service';

describe('AgendaService', () => {
  let service: AgendaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgendaService,
        {
          provide: TokenSchedulerService,
          useValue: {}, // mock
        },
        {
          provide: ConfigService,
          useValue: {}, // mock
        },
      ],
    }).compile();
    service = module.get<AgendaService>(AgendaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
