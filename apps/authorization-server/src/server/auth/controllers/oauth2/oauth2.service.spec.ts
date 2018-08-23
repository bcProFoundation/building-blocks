import { Test, TestingModule } from '@nestjs/testing';
import { OAuth2Service } from './oauth2.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthData } from '../../../models/auth-data/auth-data.entity';
import { BearerTokenService } from '../../../models/bearer-token/bearer-token.service';
import { BearerToken } from '../../../models/bearer-token/bearer-token.entity';

describe('OAuth2Service', () => {
  let service: OAuth2Service;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuth2Service,
        BearerTokenService,
        {
          provide: getRepositoryToken(BearerToken),
          useValue: {}, // provide mock values
        },
        {
          provide: getRepositoryToken(AuthData),
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
    service = module.get<OAuth2Service>(OAuth2Service);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
