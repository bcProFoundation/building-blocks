import { Test, TestingModule } from '@nestjs/testing';
import { ServerSettingsController } from './server-settings.controller';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';
import { RoleGuard } from '../../../auth/guards/role.guard';

describe('ServerSettingsController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ServerSettingsController],
      providers: [
        {
          provide: ServerSettingsService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(RoleGuard)
      .useValue({})
      .compile();
  });
  it('should be defined', () => {
    const controller: ServerSettingsController = module.get<
      ServerSettingsController
    >(ServerSettingsController);
    expect(controller).toBeDefined();
  });
});
