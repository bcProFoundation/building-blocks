import { Test, TestingModule } from '@nestjs/testing';
import { WellKnownService } from './well-known.service';
import { getModelToken } from '@nestjs/mongoose';
import { ServerSettingsService } from '../../../models/server-settings/server-settings.service';
import { SERVER_SETTINGS } from '../../../models/server-settings/server-settings.schema';
import { OIDCKeyService } from '../../../models/oidc-key/oidc-key.service';

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
