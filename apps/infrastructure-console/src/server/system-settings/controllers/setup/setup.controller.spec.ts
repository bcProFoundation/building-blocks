import { Test, TestingModule } from '@nestjs/testing';
import { SetupController } from './setup.controller';
import { SetupService } from '../../../system-settings/aggregates/setup/setup.service';

describe('SetupController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [SetupController],
      providers: [
        {
          provide: SetupService,
          useValue: {},
        },
      ],
    }).compile();
  });

  describe('message', () => {
    it('should be defined', () => {
      const settingsController = app.get<SetupController>(SetupController);
      expect(settingsController).toBeDefined();
    });
  });
});
