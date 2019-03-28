import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../user-management/entities/user/user.service';
import { OAuth2TokenGeneratorService } from '../oauth2-token-generator/oauth2-token-generator.service';
import { CryptographerService } from '../../../common/cryptographer.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { RefreshTokenExchangeService } from './refresh-token-exchange.service';
import { ConfigService } from '../../../config/config.service';

describe('RefreshTokenExchangeService', () => {
  let service: RefreshTokenExchangeService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenExchangeService,
        { provide: AuthDataService, useValue: {} },
        { provide: CryptographerService, useValue: {} },
        { provide: BearerTokenService, useValue: {} },
        { provide: UserService, useValue: {} },
        { provide: ClientService, useValue: {} },
        { provide: OAuth2TokenGeneratorService, useValue: {} },
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
    service = module.get<RefreshTokenExchangeService>(
      RefreshTokenExchangeService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
