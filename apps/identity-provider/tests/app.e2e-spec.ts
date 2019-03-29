import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppService } from '../src/app.service';
import { AppController } from '../src/app.controller';
import { SetupService } from '../src/system-settings/controllers/setup/setup.service';

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

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
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

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET /info', done => {
    return request(app.getHttpServer())
      .get('/info')
      .expect(200)
      .expect(reqResp)
      .end(done);
  });
});
