import { Test, TestingModule } from '@nestjs/testing';
import { SocialLoginManagementService } from './social-login-management.service';
import { UserService } from '../../../models/user/user.service';
import { SocialLoginService } from '../../../models/social-login/social-login.service';
import { ServerSettingsService } from '../../../models/server-settings/server-settings.service';
import { ConfigService } from '../../../config/config.service';
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
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<SocialLoginManagementService>(
      SocialLoginManagementService,
    );
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
