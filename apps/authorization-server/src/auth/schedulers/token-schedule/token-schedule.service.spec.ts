import { Test, TestingModule } from '@nestjs/testing';
import { TokenSchedulerService } from './token-schedule.service';
import { BearerTokenService } from '../../entities/bearer-token/bearer-token.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { AGENDA_CONNECTION } from '../../../common/database.provider';
import { OAuth2Service } from '../../controllers/oauth2/oauth2.service';

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
          provide: AGENDA_CONNECTION,
          useValue: {},
        },
        {
          provide: ServerSettingsService,
          useValue: {},
        },
        {
          provide: OAuth2Service,
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
