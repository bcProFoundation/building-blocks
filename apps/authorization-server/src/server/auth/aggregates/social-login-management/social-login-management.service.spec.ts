import { Test, TestingModule } from '@nestjs/testing';
import { SocialLoginManagementService } from './social-login-management.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { SocialLoginService } from '../../entities/social-login/social-login.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { HttpService } from '@nestjs/common';

describe('SocialLoginManagementService', () => {
  let service: SocialLoginManagementService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialLoginManagementService,
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: SocialLoginService,
          useValue: {},
        },
        {
          provide: ServerSettingsService,
          useValue: {},
        },
        {
          provide: HttpService,
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
