import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../models/user/user.service';
import { OAuth2TokenGeneratorService } from '../../middlewares/oauth2-token-generator.service';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { ClientService } from '../../../models/client/client.service';
import { PasswordExchangeService } from './password-exchange.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BearerTokenService } from '../../../models/bearer-token/bearer-token.service';
import { BearerToken } from '../../../models/bearer-token/bearer-token.entity';
import { User } from '../../../models/user/user.entity';
import { Client } from '../../../models/client/client.entity';
import { AuthDataService } from '../../../models/auth-data/auth-data.service';
import { AuthData } from '../../../models/auth-data/auth-data.entity';

describe('PasswordExchangeService', () => {
  let service: PasswordExchangeService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordExchangeService,
        AuthDataService,
        CryptographerService,
        BearerTokenService,
        UserService,
        ClientService,
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
          provide: getRepositoryToken(Client),
          useValue: {},
        },
        {
          provide: getRepositoryToken(AuthData),
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<PasswordExchangeService>(PasswordExchangeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
