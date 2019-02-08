import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../user-management/entities/user/user.service';
import { OAuth2TokenGeneratorService } from '../oauth2-token-generator/oauth2-token-generator.service';
import { CryptographerService } from '../../../common/cryptographer.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';
import { AuthorizationCodeService } from '../../../auth/entities/authorization-code/authorization-code.service';
import { CodeExchangeService } from './code-exchange.service';
import { ConfigService } from '../../../config/config.service';

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
          provide: CryptographerService,
          useValue: {},
        },
        {
          provide: BearerTokenService,
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
          provide: ConfigService,
          useValue: {
            get(env) {
              switch (env) {
                case 'TOKEN_VALIDITY':
                  return 3600;
              }
            },
          },
        },
      ],
    }).compile();
    service = module.get<CodeExchangeService>(CodeExchangeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
