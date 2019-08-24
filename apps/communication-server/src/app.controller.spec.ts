import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SetupService } from './system-settings/aggregates/setup/setup.service';
import { ServerSettingsService } from './system-settings/entities/server-settings/server-settings.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: SetupService,
          useValue: {
            getInfo: (...args) => ({}),
          },
        },
        {
          provide: ServerSettingsService,
          useValue: {},
        },
        {
          provide: HttpService,
          useValue: {},
        },
      ],
    }).compile();
  });

  describe('info', () => {
    it('should be defined', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.info()).toBeDefined();
    });
  });
});
