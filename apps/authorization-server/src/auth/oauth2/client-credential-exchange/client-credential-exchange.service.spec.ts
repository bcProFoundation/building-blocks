import { Test, TestingModule } from '@nestjs/testing';
import { OAuth2TokenGeneratorService } from '../oauth2-token-generator/oauth2-token-generator.service';
import { ClientCredentialExchangeService } from './client-credential-exchange.service';
import { CryptographerService } from '../../../common/services/cryptographer/cryptographer.service';
import { ConfigService } from '../../../config/config.service';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { ClientService } from '../../../client-management/entities/client/client.service';

describe('ClientCredentialExchangeService', () => {
  let service: ClientCredentialExchangeService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientCredentialExchangeService,
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
          provide: UserService,
          useValue: {},
        },
        {
          provide: ClientService,
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
    service = module.get<ClientCredentialExchangeService>(
      ClientCredentialExchangeService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
