import { Test, TestingModule } from '@nestjs/testing';
import { TokenSchedulerService } from './token-schedule.service';
import { AgendaService } from './agenda.service';
import { BearerTokenService } from '../models/bearer-token/bearer-token.service';

describe('TokenSchedulerService', () => {
  let service: TokenSchedulerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenSchedulerService,
        {
          provide: AgendaService,
          useValue: {}, // mock
        },
        {
          provide: BearerTokenService,
          useValue: {}, // mock
        },
      ],
    }).compile();
    service = module.get<TokenSchedulerService>(TokenSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
