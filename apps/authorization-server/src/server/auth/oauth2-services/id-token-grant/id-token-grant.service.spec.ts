import { Test, TestingModule } from '@nestjs/testing';
import { IDTokenGrantService } from './id-token-grant.service';
import { OIDCKeyService } from '../../../models/oidc-key/oidc-key.service';
import { ServerSettingsService } from '../../../models/server-settings/server-settings.service';
import { ConfigService } from '../../../config/config.service';

describe('IDTokenGrantService', () => {
  let service: IDTokenGrantService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IDTokenGrantService,
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
          provide: OIDCKeyService,
          useValue: {}, // Mocked service
        },
        {
          provide: ServerSettingsService,
          useValue: {}, // Mocked service
        },
      ],
    }).compile();
    service = module.get<IDTokenGrantService>(IDTokenGrantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
