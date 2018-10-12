import { Test, TestingModule } from '@nestjs/testing';
import { TokenSchedulerService } from './token-schedule.service';
import { BearerTokenService } from '../models/bearer-token/bearer-token.service';
import { ConfigService } from '../config/config.service';

describe('TokenSchedulerService', () => {
  let service: TokenSchedulerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenSchedulerService,
        {
          provide: BearerTokenService,
          useValue: {}, // mock
        },
        {
          provide: ConfigService,
          useValue: {
            get(...args) {},
          },
        },
      ],
    }).compile();
    service = module.get<TokenSchedulerService>(TokenSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
