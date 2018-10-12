import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IdentityProviderSettings } from './identity-provider-settings.entity';
import { IdentityProviderSettingsService } from './identity-provider-settings.service';

describe('IdentityProviderSettings', () => {
  let service: IdentityProviderSettingsService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdentityProviderSettingsService,
        {
          provide: getRepositoryToken(IdentityProviderSettings),
          useValue: {}, // provide mock values
        },
      ],
    }).compile();
    service = module.get<IdentityProviderSettingsService>(
      IdentityProviderSettingsService,
    );
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
