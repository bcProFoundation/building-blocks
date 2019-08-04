import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../user-management/entities/user/user.service';
import { OAuth2TokenGeneratorService } from '../oauth2-token-generator/oauth2-token-generator.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { AuthorizationCodeService } from '../../../auth/entities/authorization-code/authorization-code.service';
import { CodeExchangeService } from './code-exchange.service';
import { IDTokenGrantService } from '../id-token-grant/id-token-grant.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

describe('CodeExchangeService', () => {
  let service: CodeExchangeService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CodeExchangeService,
        {
          provide: AuthorizationCodeService,
          useValue: {},
        },
        {
          provide: OAuth2TokenGeneratorService,
          useValue: {},
        },
        {
          provide: IDTokenGrantService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: ClientService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: ServerSettingsService,
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<CodeExchangeService>(CodeExchangeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
