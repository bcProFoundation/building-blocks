import { TestingModule, Test } from '@nestjs/testing';
import { ChooseAccountMiddleware } from './choose-account.middleware';
import { UserService } from '../../user-management/entities/user/user.service';
import { ServerSettingsService } from '../../system-settings/entities/server-settings/server-settings.service';

describe('ChooseAccountMiddleware', () => {
  let middleware: ChooseAccountMiddleware;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChooseAccountMiddleware,
        {
          provide: ServerSettingsService,
          useFactory: () => jest.fn(),
        },
        {
          provide: UserService,
          useFactory: () => jest.fn(),
        },
      ],
    }).compile();

    middleware = module.get<ChooseAccountMiddleware>(ChooseAccountMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });
});
