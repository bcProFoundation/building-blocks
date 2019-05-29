import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OAuth2Provider } from './oauth2-provider.entity';
import { OAuth2ProviderService } from './oauth2-provider.service';

describe('OAuth2ProviderService', () => {
  let service: OAuth2ProviderService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuth2ProviderService,
        {
          provide: getRepositoryToken(OAuth2Provider),
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
    service = module.get<OAuth2ProviderService>(OAuth2ProviderService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
