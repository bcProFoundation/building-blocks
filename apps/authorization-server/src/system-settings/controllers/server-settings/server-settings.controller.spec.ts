import { Test, TestingModule } from '@nestjs/testing';
import { ServerSettingsController } from './server-settings.controller';
import { SystemSettingsManagementService } from '../../../system-settings/aggregates';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { UserService } from '../../../user-management/entities/user/user.service';
import { CommandBus } from '@nestjs/cqrs';
import { BearerTokenService } from '../../../auth/entities/bearer-token/bearer-token.service';

describe('ServerSettingsController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ServerSettingsController],
      providers: [
        {
          provide: SystemSettingsManagementService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: BearerTokenService,
          useValue: {},
        },
        {
          provide: CommandBus,
          useFactory: () => jest.fn(),
        },
      ],
    })
      .overrideGuard(RoleGuard)
      .useValue({})
      .compile();
  });
  it('should be defined', () => {
    const controller: ServerSettingsController = module.get<ServerSettingsController>(
      ServerSettingsController,
    );
    expect(controller).toBeDefined();
  });
});
