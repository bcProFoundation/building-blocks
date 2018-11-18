import { TestingModule, Test } from '@nestjs/testing';
import { SettingsController } from './settings.controller';
import { ServerSettingsService } from '../../models/server-settings/server-settings.service';

describe('SettingsController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        {
          provide: ServerSettingsService,
          useValue: {},
        },
      ],
    }).compile();
  });
  it('should be defined', () => {
    const controller: SettingsController = module.get<SettingsController>(
      SettingsController,
    );
    expect(controller).toBeDefined();
  });
});
