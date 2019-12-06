import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { UserService } from '../../../user-management/entities/user/user.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { AuthorizationCodeService } from '../../../auth/entities/authorization-code/authorization-code.service';
import { CodeExchangeService } from './code-exchange.service';
import { IDTokenGrantService } from '../id-token-grant/id-token-grant.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { BearerTokenService } from '../../entities/bearer-token/bearer-token.service';

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
          provide: CommandBus,
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
        {
          provide: BearerTokenService,
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
