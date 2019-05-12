import { Test, TestingModule } from '@nestjs/testing';
import { OAuth2TokenService } from './oauth2-token.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OAuth2Token } from './oauth2-token.entity';

describe('Oauth2TokenService', () => {
  let service: OAuth2TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuth2TokenService,
        { provide: getRepositoryToken(OAuth2Token), useValue: {} },
      ],
    }).compile();

    service = module.get<OAuth2TokenService>(OAuth2TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
