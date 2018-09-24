import { Test, TestingModule } from '@nestjs/testing';
import { ServerSettingsController } from './server-settings.controller';
import { getModelToken } from '@nestjs/mongoose';
import { ServerSettingsService } from '../../../models/server-settings/server-settings.service';
import { SERVER_SETTINGS } from '../../../models/server-settings/server-settings.schema';

describe('ServerSettingsController', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ServerSettingsController],
      providers: [
        ServerSettingsService,
        {
          provide: getModelToken(SERVER_SETTINGS),
          useValue: {},
        },
      ],
    }).compile();
  });
  it('should be defined', () => {
    const controller: ServerSettingsController = module.get<
      ServerSettingsController
    >(ServerSettingsController);
    expect(controller).toBeDefined();
  });
});
