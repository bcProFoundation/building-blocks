import { Test, TestingModule } from '@nestjs/testing';
import { EmailAccountService } from '../../../email/entities/email-account/email-account.service';
import { TokenCacheService } from '../../../auth/entities/token-cache/token-cache.service';
import { ConnectController } from './connect.controller';
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
          provide: EmailAccountService,
          useValue: {},
        },
        {
          provide: ServerSettingsService,
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
