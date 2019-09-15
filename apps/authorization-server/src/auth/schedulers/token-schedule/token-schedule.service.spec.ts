import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { TokenSchedulerService } from './token-schedule.service';
import { BearerTokenService } from '../../entities/bearer-token/bearer-token.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { AGENDA_CONNECTION } from '../../../common/database.provider';

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
          provide: AGENDA_CONNECTION,
          useValue: {},
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
