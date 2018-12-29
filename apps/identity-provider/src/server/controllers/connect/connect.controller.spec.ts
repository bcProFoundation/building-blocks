import { Test, TestingModule } from '@nestjs/testing';
import { TokenCacheService } from '../../models/token-cache/token-cache.service';
import { ConnectController } from './connect.controller';
import { AuthServerVerificationGuard } from '../../guards/authserver-verification.guard';
import { ProfileService } from '../../models/profile/profile.service';

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
