import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

describe('SettingsController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [
        {
          provide: SettingsService,
          useValue: {}, // mock
        },
      ],
    }).compile();
  });

  describe('message', () => {
    it('should be defined', () => {
      const settingsController = app.get<SettingsController>(
        SettingsController,
      );
      expect(settingsController).toBeDefined();
    });
  });
});
