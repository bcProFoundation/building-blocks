import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../models/user/user.service';
import { OAuth2TokenGeneratorService } from '../../middlewares/oauth2-token-generator.service';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { ClientService } from '../../../models/client/client.service';
import { PasswordExchangeService } from './password-exchange.service';
import { BearerTokenService } from '../../../models/bearer-token/bearer-token.service';
import { AuthDataService } from '../../../models/auth-data/auth-data.service';
import { getModelToken } from '@nestjs/mongoose';
import { BEARER_TOKEN } from '../../../models/bearer-token/bearer-token.schema';
import { USER } from '../../../models/user/user.schema';
import { CLIENT } from '../../../models/client/client.schema';
import { AUTH_DATA } from '../../../models/auth-data/auth-data.schema';
import { ConfigService } from '../../../config/config.service';

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
          provide: getModelToken(CLIENT),
          useValue: {},
        },
        {
          provide: getModelToken(AUTH_DATA),
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
