import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppService } from '../src/server/app.service';
import { AppController } from '../src/server/app.controller';
import { SetupService } from '../src/server/controllers/setup/setup.service';

const reqResp = {
  appURL: 'http://infra.localhost:3200',
  authServerURL: 'http://auth.localhost:3000',
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

  it('/GET /info', () => {
    return request(app.getHttpServer())
      .get('/info')
      .expect(200)
      .expect(reqResp);
  });
});
