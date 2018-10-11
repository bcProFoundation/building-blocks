import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SetupService } from 'controllers/setup/setup.service';

const reqResp = {
  appURL: 'http://infra.localhost:5000',
  authServerURL: 'http://auth.localhost:3000',
};

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
            async getInfo() {
              return reqResp;
            },
          },
        },
      ],
    }).compile();
  });

  describe('info', () => {
    it('should return "{ message: APP_NAME }"', async () => {
      const appController = app.get<AppController>(AppController);
      expect(await appController.info()).toEqual({
        appURL: 'http://infra.localhost:5000',
        authServerURL: 'http://auth.localhost:3000',
      });
    });
  });
});
