import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../models/user/user.service';
import { OAuth2TokenGeneratorService } from '../../middlewares/oauth2-token-generator.service';
import { ClientService } from '../../../models/client/client.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BearerToken } from '../../../models/bearer-token/bearer-token.entity';
import { User } from '../../../models/user/user.entity';
import { Client } from '../../../models/client/client.entity';
import { AuthorizationCode } from '../../../models/authorization-code/authorization-code.entity';
import { TokenGrantService } from './token-grant.service';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { BearerTokenService } from '../../../models/bearer-token/bearer-token.service';
import { AuthData } from '../../../models/auth-data/auth-data.entity';

describe('TokenGrantService', () => {
  let service: TokenGrantService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenGrantService,
        UserService,
        ClientService,
        OAuth2TokenGeneratorService,
        CryptographerService,
        BearerTokenService,
        {
          provide: getRepositoryToken(BearerToken),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getRepositoryToken(AuthData),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Client),
          useValue: {},
        },
        {
          provide: getRepositoryToken(AuthorizationCode),
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<TokenGrantService>(TokenGrantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
