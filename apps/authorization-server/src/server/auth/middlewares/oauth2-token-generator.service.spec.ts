import { Test, TestingModule } from '@nestjs/testing';
import { OAuth2TokenGeneratorService } from './oauth2-token-generator.service';
import { CryptographerService } from '../../utilities/cryptographer.service';
import { BearerTokenService } from '../../models/bearer-token/bearer-token.service';
import { ClientService } from '../../models/client/client.service';
import { UserService } from '../../models/user/user.service';
import { getModelToken } from '@nestjs/mongoose';
import { BEARER_TOKEN } from '../../models/bearer-token/bearer-token.schema';
import { USER } from '../../models/user/user.schema';
import { AUTH_DATA } from '../../models/auth-data/auth-data.schema';
import { CLIENT } from '../../models/client/client.schema';

describe('OAuth2TokenGeneratorService', () => {
  let service: OAuth2TokenGeneratorService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuth2TokenGeneratorService,
        CryptographerService,
        BearerTokenService,
        ClientService,
        UserService,
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
