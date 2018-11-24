import { Test, TestingModule } from '@nestjs/testing';
import { TokenSchedulerService } from './token-schedule.service';
import { BearerTokenService } from '../models/bearer-token/bearer-token.service';
import { ConfigService } from '../config/config.service';
import { ClientService } from '../models/client/client.service';
import { HttpService } from '@nestjs/common';

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
          provide: ClientService,
          useValue: {}, // mock
        },
        {
          provide: HttpService,
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
