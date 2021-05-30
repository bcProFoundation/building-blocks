import { Test, TestingModule } from '@nestjs/testing';
import { ConnectController } from './connect.controller';
import { AuthServerVerificationGuard } from '../../../auth/guards/authserver-verification.guard';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ConnectService } from './connect.service';

describe('ConnectController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ConnectController],
      providers: [
        {
          provide: ConnectService,
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
    const controller: ConnectController =
      module.get<ConnectController>(ConnectController);
    expect(controller).toBeDefined();
  });
});
