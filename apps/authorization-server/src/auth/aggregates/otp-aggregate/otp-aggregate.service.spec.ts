import { Test, TestingModule } from '@nestjs/testing';
import { OTPAggregateService } from './otp-aggregate.service';
import { HttpService } from '@nestjs/common';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { ConfigService } from '../../../config/config.service';

describe('OTPAggregateService', () => {
  let service: OTPAggregateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OTPAggregateService,
        {
          provide: HttpService,
          useValue: {},
        },
        {
          provide: ServerSettingsService,
          useValue: {},
        },
        {
          provide: ClientService,
          useValue: {},
        },
        {
          provide: AuthDataService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<OTPAggregateService>(OTPAggregateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
