import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { i18n } from './i18n/i18n.config';

describe('AppController', () => {
  let app: TestingModule;
  let req;
  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    // Mock Express req object
    req = {
      // session
      isAuthenticated: () => false,

      // i18n
      setLocale: (...args) => args[0],
      __: (...args) => args[0],
      getLocale: (...args) => args[0],
      getCatalog: (...args) => args[0],
    };
  });

  describe('info', () => {
    it('should return "{ message: APP_NAME, session: false }"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.info(req)).toEqual({
        message: i18n.__('Authorization Server'),
        session: false,
      });
    });
  });
});
