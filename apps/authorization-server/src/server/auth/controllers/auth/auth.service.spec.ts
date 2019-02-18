import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CryptographerService } from '../../../common/cryptographer.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

describe('AuthService', () => {
  let service: AuthService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: CryptographerService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: AuthDataService,
          useValue: {},
        },
        {
          provide: ServerSettingsService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({})
      .compile();
    service = module.get<AuthService>(AuthService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
