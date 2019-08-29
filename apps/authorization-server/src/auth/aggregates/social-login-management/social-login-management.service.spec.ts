import { Test, TestingModule } from '@nestjs/testing';
import { SocialLoginManagementService } from './social-login-management.service';
import { SocialLoginService } from '../../entities/social-login/social-login.service';
import { UserService } from '../../../user-management/entities/user/user.service';

describe('SocialLoginManagementService', () => {
  let service: SocialLoginManagementService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialLoginManagementService,
        {
          provide: SocialLoginService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
      ],
    })
      .overrideProvider(SocialLoginManagementService)
      .useFactory({ factory: () => jest.fn() })
      .compile();
    service = module.get<SocialLoginManagementService>(
      SocialLoginManagementService,
    );
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
