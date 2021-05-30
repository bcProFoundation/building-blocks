import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppService } from '../src/app.service';
import { AppController } from '../src/app.controller';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: { info: (...args) => {} } }],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET /info', () => {
    return request(app.getHttpServer()).get('/info').expect(200);
  });
});
