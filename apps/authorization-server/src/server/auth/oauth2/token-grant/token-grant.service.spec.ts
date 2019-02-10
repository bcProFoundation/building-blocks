import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../user-management/entities/user/user.service';
import { OAuth2TokenGeneratorService } from '../oauth2-token-generator/oauth2-token-generator.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { TokenGrantService } from './token-grant.service';
import { CryptographerService } from '../../../common/cryptographer.service';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';
import { ConfigService } from '../../../config/config.service';

describe('TokenGrantService', () => {
  let service: TokenGrantService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenGrantService,
        { provide: UserService, useValue: {} },
        { provide: ClientService, useValue: {} },
        { provide: OAuth2TokenGeneratorService, useValue: {} },
        { provide: CryptographerService, useValue: {} },
        { provide: BearerTokenService, useValue: {} },
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
    service = module.get<TokenGrantService>(TokenGrantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
