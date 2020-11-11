import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { AuthService } from './auth.service';
import { CryptographerService } from '../../../common/services/cryptographer/cryptographer.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { PasswordPolicyService } from '../../../user-management/policies/password-policy/password-policy.service';

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
        {
          provide: PasswordPolicyService,
          useValue: {},
        },
        {
          provide: CommandBus,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
