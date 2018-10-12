import { Test, TestingModule } from '@nestjs/testing';
import { WellKnownService } from './well-known.service';
import { ServerSettingsService } from '../server-settings/server-settings.service';
import { OIDCKeyService } from '../oidc-key/oidc-key.service';
import { getModelToken } from '@nestjs/mongoose';
import { SERVER_SETTINGS } from '../server-settings/server-settings.schema';

describe('WellKnownService', () => {
  let service: WellKnownService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WellKnownService,
        ServerSettingsService,
        {
          provide: getModelToken(SERVER_SETTINGS),
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
