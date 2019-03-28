import { Test, TestingModule } from '@nestjs/testing';
import { OAuth2TokenGeneratorService } from './oauth2-token-generator.service';
import { CryptographerService } from '../../../common/cryptographer.service';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { ConfigService } from '../../../config/config.service';

describe('OAuth2TokenGeneratorService', () => {
  let service: OAuth2TokenGeneratorService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuth2TokenGeneratorService,
        { provide: CryptographerService, useValue: {} },
        { provide: BearerTokenService, useValue: {} },
        { provide: ClientService, useValue: {} },
        { provide: UserService, useValue: {} },
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
    service = module.get<OAuth2TokenGeneratorService>(
      OAuth2TokenGeneratorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
