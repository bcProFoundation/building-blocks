import { Test, TestingModule } from '@nestjs/testing';
import { EmailAccountService } from '../../models/email-account/email-account.service';
import { TokenCacheService } from '../../models/token-cache/token-cache.service';
import { ConnectController } from './connect.controller';
import { AuthServerVerificationGuard } from '../../guards/authserver-verification.guard';

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