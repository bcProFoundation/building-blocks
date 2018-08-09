import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppService } from 'app.service';
import { AuthDataService } from 'models/auth-data/auth-data.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthData } from 'models/auth-data/auth-data.entity';
import { AuthController } from 'auth/controllers/auth/auth.controller';
import { BearerTokenService } from 'models/bearer-token/bearer-token.service';
import { BearerToken } from 'models/bearer-token/bearer-token.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AppService,
        {
          provide: 'AuthService',
          useValue: {
            signUp() {},
          },
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

  it('/POST /auth/login', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@user.org',
        password: 'secret',
        redirect: '/account',
      })
      .expect(200)
      .expect({ user: 'test@user.org', path: '/account' });
  });

  it('/POST /auth/signup', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test@user.org', password: 'secret', name: 'Test User' })
      .expect(200)
      .expect({ user: 'test@user.org', message: 'success' });
  });

  it('/POST /auth/signup (invalid email)', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'testuser.org', password: 'secret', name: 'Test User' })
      .expect(400);
  });

  it('/POST /auth/signup (blank password)', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test@user.org', password: '', name: 'Test User' })
      .expect(400);
  });
});
