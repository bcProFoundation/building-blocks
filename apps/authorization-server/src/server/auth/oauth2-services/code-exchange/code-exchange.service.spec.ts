import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../models/user/user.service';
import { OAuth2TokenGeneratorService } from '../../middlewares/oauth2-token-generator.service';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { ClientService } from '../../../models/client/client.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BearerTokenService } from '../../../models/bearer-token/bearer-token.service';
import { BearerToken } from '../../../models/bearer-token/bearer-token.entity';
import { User } from '../../../models/user/user.entity';
import { Client } from '../../../models/client/client.entity';
import { AuthorizationCodeService } from '../../../models/authorization-code/authorization-code.service';
import { CodeExchangeService } from './code-exchange.service';
import { AuthorizationCode } from '../../../models/authorization-code/authorization-code.entity';
import { AuthData } from '../../../models/auth-data/auth-data.entity';

describe('CodeExchangeService', () => {
  let service: CodeExchangeService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CodeExchangeService,
        AuthorizationCodeService,
        OAuth2TokenGeneratorService,
        CryptographerService,
        BearerTokenService,
        ClientService,
        UserService,
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
    service = module.get<CodeExchangeService>(CodeExchangeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
