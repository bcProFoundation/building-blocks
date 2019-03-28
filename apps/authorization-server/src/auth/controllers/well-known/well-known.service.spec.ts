import { Test, TestingModule } from '@nestjs/testing';
import { WellKnownService } from './well-known.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { OIDCKeyService } from '../../../auth/entities/oidc-key/oidc-key.service';

describe('WellKnownService', () => {
  let service: WellKnownService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WellKnownService,
        {
          provide: ServerSettingsService,
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
