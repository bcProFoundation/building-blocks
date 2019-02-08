import { Test, TestingModule } from '@nestjs/testing';
import { UserAggregateService } from './user-aggregate.service';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { UserService } from '../../../user-management/entities/user/user.service';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';

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
      ],
    }).compile();

    service = module.get<UserAggregateService>(UserAggregateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
