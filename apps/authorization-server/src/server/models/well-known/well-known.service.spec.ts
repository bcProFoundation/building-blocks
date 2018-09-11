import { Test, TestingModule } from '@nestjs/testing';
import { WellKnownService } from './well-known.service';
import { ServerSettingsService } from '../server-settings/server-settings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServerSettings } from '../server-settings/server-settings.entity';
import { OIDCKeyService } from '../oidc-key/oidc-key.service';

describe('WellKnownService', () => {
  let service: WellKnownService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WellKnownService,
        ServerSettingsService,
        {
          provide: getRepositoryToken(ServerSettings),
          useValue: {}, // provide mock values
        },
        {
          provide: OIDCKeyService,
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<WellKnownService>(WellKnownService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
