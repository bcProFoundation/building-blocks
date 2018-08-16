import { Test, TestingModule } from '@nestjs/testing';
import { OAuth2TokenGeneratorService } from './oauth2-token-generator.service';
import { CryptographerService } from '../../utilities/cryptographer.service';
import { BearerTokenService } from '../../models/bearer-token/bearer-token.service';
import { ScopeService } from '../../models/scope/scope.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BearerToken } from '../../models/bearer-token/bearer-token.entity';
import { Scope } from '../../models/scope/scope.entity';

describe('OAuth2TokenGeneratorService', () => {
  let service: OAuth2TokenGeneratorService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuth2TokenGeneratorService,
        CryptographerService,
        BearerTokenService,
        ScopeService,
        {
          provide: getRepositoryToken(BearerToken),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Scope),
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
