import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_NAME } from './constants/messages';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('info', () => {
    it('should return "{ message: APP_NAME }"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.info()).toEqual({ message: APP_NAME });
    });
  });
});
