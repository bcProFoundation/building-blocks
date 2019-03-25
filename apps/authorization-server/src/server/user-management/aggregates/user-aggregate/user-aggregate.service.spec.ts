import { Test, TestingModule } from '@nestjs/testing';
import { UserAggregateService } from './user-aggregate.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { UserService } from '../../entities/user/user.service';
import { AuthDataService } from '../../entities/auth-data/auth-data.service';
import { CryptographerService } from '../../../common/cryptographer.service';
import { PasswordPolicyService } from '../../policies/password-policy/password-policy.service';
import { RoleValidationPolicyService } from '../../policies/role-validation-policy/role-validation-policy.service';

describe('UserAggregateService', () => {
  let service: UserAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAggregateService,
        {
          provide: ServerSettingsService,
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
          provide: CryptographerService,
          useValue: {},
        },
        {
          provide: PasswordPolicyService,
          useValue: {},
        },
        {
          provide: RoleValidationPolicyService,
          useValue: {},
        },
      ],
    })
      .overrideProvider(UserAggregateService)
      .useFactory({ factory: () => jest.fn() })
      .compile();

    service = module.get<UserAggregateService>(UserAggregateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
