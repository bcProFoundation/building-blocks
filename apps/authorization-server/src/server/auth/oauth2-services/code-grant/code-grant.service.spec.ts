import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../models/user/user.service';
import { OAuth2TokenGeneratorService } from '../../middlewares/oauth2-token-generator.service';
import { AuthorizationCodeService } from '../../../models/authorization-code/authorization-code.service';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { ClientService } from '../../../models/client/client.service';
import { CodeGrantService } from './code-grant.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BearerTokenService } from '../../../models/bearer-token/bearer-token.service';
import { BearerToken } from '../../../models/bearer-token/bearer-token.entity';
import { User } from '../../../models/user/user.entity';
import { Client } from '../../../models/client/client.entity';
import { AuthorizationCode } from '../../../models/authorization-code/authorization-code.entity';
import { AuthData } from '../../../models/auth-data/auth-data.entity';

describe('CodeGrantService', () => {
  let service: CodeGrantService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CodeGrantService,
        CryptographerService,
        BearerTokenService,
        UserService,
        ClientService,
        AuthorizationCodeService,
        OAuth2TokenGeneratorService,
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
    service = module.get<CodeGrantService>(CodeGrantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
