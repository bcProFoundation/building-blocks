import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppService } from 'app.service';
import { AppController } from 'app.controller';
import { ClientService } from 'models/client/client.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from 'models/client/client.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        ClientService,
        {
          provide: getRepositoryToken(Client),
          useValue: {}, // mock
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET /message', () => {
    return request(app.getHttpServer())
      .get('/message')
      .expect(200)
      .expect({ message: 'NestJS' });
  });
});
