import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/server/app.module';
import { ExpressServer } from '../src/server/express-server';
import 'jest';
import { ConfigService } from '../src/server/config/config.service';
import { UserService } from '../src/server/user-management/entities/user/user.service';
jest.setTimeout(30000);

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  const authServer = new ExpressServer(new ConfigService());

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication(
      new ExpressAdapter(authServer.server),
    );
    authServer.setupSession(app);
    await app.init();

    userService = moduleFixture.get(UserService);
  });

  it('/POST /auth/signup', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'test@user.org',
        phone: '+919876543211', // admin@user.org is +919876543210
        password: '14CharP@ssword',
        name: 'Test User',
      })
      .expect(200);
  });

  it('/POST /auth/signup (invalid email)', done => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'testuser.org',
        password: 'secret',
        phone: '+910987654321',
        name: 'Test User',
      })
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('/POST /auth/signup (blank password)', done => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'testuser.org',
        password: '',
        phone: '+91987654444',
        name: 'Test User',
      })
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('/POST /auth/logout', done => {
    return request(app.getHttpServer())
      .get('/auth/logout')
      .expect(302)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  afterAll(async () => {
    await userService.deleteByEmail('test@user.org');
    await app.close();
  });
});
