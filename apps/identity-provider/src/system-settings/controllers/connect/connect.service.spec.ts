import { Test, TestingModule } from '@nestjs/testing';
import { ConnectService } from './connect.service';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { ProfileService } from '../../../profile-management/entities/profile/profile.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

describe('ConnectService', () => {
  let service: ConnectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectService,
        { provide: TokenCacheService, useValue: {} },
        { provide: ProfileService, useValue: {} },
        { provide: ServerSettingsService, useValue: {} },
      ],
    }).compile();

    service = module.get<ConnectService>(ConnectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
