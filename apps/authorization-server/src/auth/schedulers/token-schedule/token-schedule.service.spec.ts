import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { TokenSchedulerService } from './token-schedule.service';
import { ConfigService } from '../../../config/config.service';
import { BearerTokenService } from '../../entities/bearer-token/bearer-token.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

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
        {
          provide: ServerSettingsService,
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<TokenSchedulerService>(TokenSchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
