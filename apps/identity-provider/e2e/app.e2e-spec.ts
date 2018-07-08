import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppService } from 'app.service';
import { AppController } from 'app.controller';
import { AuthController } from 'auth/controllers/auth/auth.controller';
import { AuthService } from 'auth/controllers/auth/auth.service';
import { AuthDataService } from 'models/auth-data/auth-data.service';
import { BearerTokenService } from 'models/bearer-token/bearer-token.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BearerToken } from 'models/bearer-token/bearer-token.entity';
import { AuthData } from 'models/auth-data/auth-data.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [AuthController, AppController],
      providers: [
        AppService,
        {
          provide: 'AuthService',
          useValue: AuthService,
        },
        {
          provide: 'AuthDataService',
          useValue: AuthDataService,
        },
        {
          provide: 'BearerTokenService',
          useValue: BearerTokenService,
        },
        {
          provide: getRepositoryToken(BearerToken),
          useValue: {},
        },
        {
          provide: getRepositoryToken(AuthData),
          useValue: {},
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET /', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('IDP built using Nest.js');
  });

  it('/GET /logout', () => {
    return request(app.getHttpServer())
      .get('/logout')
      .expect(200)
      .expect({ message: 'logout' });
  });
});
