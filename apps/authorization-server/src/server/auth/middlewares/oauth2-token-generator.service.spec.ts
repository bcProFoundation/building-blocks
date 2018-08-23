import { Test, TestingModule } from '@nestjs/testing';
import { OAuth2TokenGeneratorService } from './oauth2-token-generator.service';
import { CryptographerService } from '../../utilities/cryptographer.service';
import { BearerTokenService } from '../../models/bearer-token/bearer-token.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BearerToken } from '../../models/bearer-token/bearer-token.entity';
import { ClientService } from '../../models/client/client.service';
import { UserService } from '../../models/user/user.service';
import { User } from '../../models/user/user.entity';
import { Client } from '../../models/client/client.entity';

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
