import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SetupService } from './controllers/setup/setup.service';
import { ServerSettingsService } from './models/server-settings/server-settings.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServerSettings } from './models/server-settings/server-settings.entity';
import { HttpService } from '@nestjs/common';
import { from } from 'rxjs';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        SetupService,
        ServerSettingsService,
        {
          provide: getRepositoryToken(ServerSettings),
          useValue: {
            find: (...args) => [],
          }, // provide mock values
        },
        {
          provide: HttpService,
          useValue: {
            get() {
              return from([]);
            },
          },
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
