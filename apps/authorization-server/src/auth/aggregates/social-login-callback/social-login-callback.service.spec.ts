import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SocialLoginCallbackService } from './social-login-callback.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { SocialLoginService } from '../../entities/social-login/social-login.service';

describe('SocialLoginCallbackService', () => {
  let service: SocialLoginCallbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialLoginCallbackService,
        {
          provide: SocialLoginService,
          useValue: {},
        },
        {
          provide: UserService,
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
        {
          provide: CommandBus,
          useValue: {
            get: (...args) => Promise.resolve(),
          },
        },
      ],
    }).compile();

    service = module.get<SocialLoginCallbackService>(
      SocialLoginCallbackService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
