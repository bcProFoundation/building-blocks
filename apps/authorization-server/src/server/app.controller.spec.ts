import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_NAME } from './constants/messages';

describe('AppController', () => {
  let app: TestingModule;
  let req;
  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    req = {
      isAuthenticated() {
        return false;
      },
    };
  });

  describe('info', () => {
    it('should return "{ message: APP_NAME }"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.info(req)).toEqual({
        message: APP_NAME,
        session: false,
      });
    });
  });
});
