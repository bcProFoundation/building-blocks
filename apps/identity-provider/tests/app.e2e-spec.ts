import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppService } from 'app.service';
import { AppController } from 'app.controller';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET /message', (done) => {
    return request(app.getHttpServer())
      .get('/message')
      .expect(200)
      .expect({ message: 'NestJS' })
      .end(done);
  });
});
