import { Test } from '@nestjs/testing';
import * as request from 'supertest-session';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/server/app.module';
import { ExpressServer } from '../src/server/express-server';
import { UserService } from '../src/server/models/user/user.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let sessionRequest;
  const authServer = new ExpressServer();

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication(authServer.server);
    userService = moduleFixture.get(UserService);
    authServer.setupSession(app);
    sessionRequest = request(app.getHttpServer());
    await app.init();
  });

  it('/POST /auth/signup', async () => {
    await userService.deleteByEmail('test@user.org');
    return sessionRequest
      .post('/auth/signup')
      .send({
        email: 'test@user.org',
        phone: '+919876543211', // admin@user.org is +919876543210
        password: 'secret',
        name: 'Test User',
      })
      .expect(200);
  });

  it('/POST /auth/signup (invalid email)', () => {
    return sessionRequest
      .post('/auth/signup')
      .send({
        email: 'testuser.org',
        password: 'secret',
        phone: '+910987654321',
        name: 'Test User',
      })
      .expect(400);
  });

  it('/POST /auth/signup (blank password)', () => {
    return sessionRequest
      .post('/auth/signup')
      .send({
        email: 'testuser.org',
        password: '',
        phone: '+910987654321',
        name: 'Test User',
      })
      .expect(400);
  });

  it('/POST /auth/logout', () => {
    return sessionRequest
      .get('/auth/logout')
      .expect(200)
      .expect({ message: 'logout' });
  });

  afterAll(async () => await app.close());
});
