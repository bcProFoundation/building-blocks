import { Test, TestingModule } from '@nestjs/testing';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { ConnectController } from './connect.controller';
import { ProfileService } from '../../../profile-management/entities/profile/profile.service';
import { AuthServerVerificationGuard } from '../../../auth/guards/authserver-verification.guard';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

describe('ConnectController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ConnectController],
      providers: [
        {
          provide: TokenCacheService,
          useValue: {},
        },
        {
          provide: ProfileService,
          useValue: {},
        },
        {
          provide: ServerSettingsService,
          useValue: {},
        },
        {
          provide: AuthServerVerificationGuard,
          useValue: {},
        },
      ],
    })
      .overrideGuard(AuthServerVerificationGuard)
      .useValue({})
      .compile();
  });
  it('should be defined', () => {
    const controller: ConnectController = module.get<ConnectController>(
      ConnectController,
    );
    expect(controller).toBeDefined();
  });
});
