import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SetupService } from './controllers/setup/setup.service';

const reqResp = {
  uuid: '19421784-bb3d-4b4a-8994-dfe8f3eddf5a',
  _id: '5ba0a00ca346651ecdf5af0c',
  appURL: 'http://myprofile.localhost:3200',
  authServerURL: 'http://auth.localhost:3000',
  clientId: 'fb670ac1-03e3-4618-8db1-8bca8131018c',
  profileURL: 'http://auth.localhost:3000/oauth2/profile',
  tokenURL: 'http://auth.localhost:3000/oauth2/get_token',
  introspectionURL: 'http://auth.localhost:3000/oauth2/introspection',
  authorizationURL: 'http://auth.localhost:3000/oauth2/confirmation',
  callbackURLs: ['http://myprofile.localhost:3200/index.html'],
  revocationURL: 'http://auth.localhost:3000/oauth2/revoke',
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
    it('should return "NestJS"', async () => {
      const appController = app.get<AppController>(AppController);
      expect(await appController.info()).toEqual(reqResp);
    });
  });
});
