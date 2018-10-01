import { Test, TestingModule } from '@nestjs/testing';
import { OAuth2TokenGeneratorService } from '../../middlewares/oauth2-token-generator.service';
import { ClientService } from '../../../models/client/client.service';
import { ClientCredentialExchangeService } from './client-credential-exchange.service';
import { UserService } from '../../../models/user/user.service';
import { BearerTokenService } from '../../../models/bearer-token/bearer-token.service';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { getModelToken } from '@nestjs/mongoose';
import { BEARER_TOKEN } from '../../../models/bearer-token/bearer-token.schema';
import { USER } from '../../../models/user/user.schema';
import { AUTH_DATA } from '../../../models/auth-data/auth-data.schema';
import { CLIENT } from '../../../models/client/client.schema';
import { AUTHORIZATION_CODE } from '../../../models/authorization-code/authorization-code.schema';
import { ConfigService } from '../../../config/config.service';

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
        {
          provide: getModelToken(BEARER_TOKEN),
          useValue: {},
        },
        {
          provide: getModelToken(USER),
          useValue: {},
        },
        {
          provide: getModelToken(AUTH_DATA),
          useValue: {},
        },
        {
          provide: getModelToken(CLIENT),
          useValue: {},
        },
        {
          provide: getModelToken(AUTHORIZATION_CODE),
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
