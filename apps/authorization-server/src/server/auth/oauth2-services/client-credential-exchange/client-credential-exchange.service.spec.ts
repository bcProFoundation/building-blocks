import { Test, TestingModule } from '@nestjs/testing';
import { OAuth2TokenGeneratorService } from '../../middlewares/oauth2-token-generator.service';
import { ClientService } from '../../../models/client/client.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BearerToken } from '../../../models/bearer-token/bearer-token.entity';
import { User } from '../../../models/user/user.entity';
import { Client } from '../../../models/client/client.entity';
import { AuthorizationCode } from '../../../models/authorization-code/authorization-code.entity';
import { ClientCredentialExchangeService } from './client-credential-exchange.service';
import { UserService } from '../../../models/user/user.service';
import { BearerTokenService } from '../../../models/bearer-token/bearer-token.service';
import { CryptographerService } from '../../../utilities/cryptographer.service';

describe('ClientCredentialExchangeService', () => {
  let service: ClientCredentialExchangeService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientCredentialExchangeService,
        OAuth2TokenGeneratorService,
        CryptographerService,
        BearerTokenService,
        UserService,
        ClientService,
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
          provide: getRepositoryToken(AuthorizationCode),
          useValue: {},
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
