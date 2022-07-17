import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { hotp, totp } from 'otplib';
import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import 'jest';

import { AppModule } from '../src/app.module';
import { ExpressServer } from '../src/express-server';
import {
  getParameterByName,
  OIDCKey,
  validateUsersAndAuthData,
  delay,
  stopServices,
} from './e2e-helpers';
import { UserService } from '../src/user-management/entities/user/user.service';
import { OIDCKeyService } from '../src/auth/entities/oidc-key/oidc-key.service';
import { ConfigService } from '../src/config/config.service';
import { KeyPairGeneratorService } from '../src/auth/schedulers';
import { RoleService } from '../src/user-management/entities/role/role.service';
import { Role } from '../src/user-management/entities/role/role.interface';
import {
  ADMINISTRATOR,
  INFRASTRUCTURE_CONSOLE,
} from '../src/constants/app-strings';
import { AuthDataType } from '../src/user-management/entities/auth-data/auth-data.interface';
import { USER } from '../src/user-management/entities/user/user.schema';
import { User } from '../src/user-management/entities/user/user.interface';
import { AuthDataService } from '../src/user-management/entities/auth-data/auth-data.service';
import { ClientService } from '../src/client-management/entities/client/client.service';

jest.setTimeout(30000);

describe('AppModule (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let clientId: string;
  let redirectUris: string[];
  let allowedScopes: string[];
  let Cookies;
  let authDataService: AuthDataService;
  let roleService: RoleService;
  let userService: UserService;
  let clientService: ClientService;
  let userAccessToken: string;
  let adminRole: Role;
  let testUser: User;
  let sharedSecret: string;
  let forgottenPasswordVerificationCode: string;
  const adminEmail = 'admin@user.org';
  const adminPassword = '14CharP@ssword';
  const adminPhone = '+919876543210';
  const issuerUrl = 'http://accounts.localhost:3000';
  const authServer = new ExpressServer(new ConfigService());

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(
      new ExpressAdapter(authServer.server),
    );
    authServer.setupSession(app);
    const keyPairService = moduleFixture.get(KeyPairGeneratorService);
    keyPairService.generateKeyPair = jest.fn(() => Promise.resolve());

    await app.init();
    const oidcKeyService = moduleFixture.get(OIDCKeyService);
    const oidcKey = await oidcKeyService.findOne({});
    if (!oidcKey) await oidcKeyService.save(OIDCKey);

    userService = moduleFixture.get(UserService);
    roleService = moduleFixture.get(RoleService);
    authDataService = moduleFixture.get(AuthDataService);
    clientService = moduleFixture.get(ClientService);

    // Run POST /setup

    let res;
    let client;
    try {
      res = await request(app.getHttpServer())
        .post('/setup')
        .send({
          fullName: 'Administrator',
          email: adminEmail,
          infrastructureConsoleUrl: 'http://admin.localhost:5000',
          issuerUrl,
          adminPassword,
          phone: adminPhone,
        })
        .expect(201);
      clientId = res.body.clientId;
      client = await clientService.findOne({ clientId });
    } catch (error) {
      client = await clientService.findOne({ name: INFRASTRUCTURE_CONSOLE });
      clientId = client.clientId;
    }

    redirectUris = client.redirectUris;
    allowedScopes = client.allowedScopes;
    adminRole = await roleService.findOne({ name: ADMINISTRATOR });
  });

  it('/POST /auth/login', done => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: adminEmail,
        password: adminPassword,
        redirect: '/account',
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        Cookies = res.header['set-cookie'].pop().split(';')[0];
        done();
      });
  });

  it('/GET /oauth2/confirmation (Get User Access Token)', done => {
    const authRequest = `/oauth2/confirmation?scope=${allowedScopes.join(
      '%20',
    )}&response_type=token&client_id=${clientId}&redirect_uri=${
      redirectUris[0]
    }&state=420`;
    const req = request(app.getHttpServer()).get(authRequest);
    req.cookies = Cookies;
    req.end((err, response) => {
      if (err) return done(err);
      const state = getParameterByName(response.header.location, 'state');
      userAccessToken = getParameterByName(
        response.header.location,
        'access_token',
      );
      expect(state).toEqual('420');
      done();
    });
  });

  it('/POST /role/v1/create (Fail to add Role with existing name)', done => {
    request(app.getHttpServer())
      .post('/role/v1/create')
      .set('Authorization', 'Bearer ' + userAccessToken)
      .send({ name: 'administrator' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('/POST /role/v1/update (Fail update of user used role name)', done => {
    request(app.getHttpServer())
      .post('/role/v1/update/' + adminRole.uuid)
      .set('Authorization', 'Bearer ' + userAccessToken)
      .send({ name: 'admin' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('/POST /role/v1/delete (Fail delete of user used role name)', done => {
    request(app.getHttpServer())
      .post('/role/v1/delete/' + adminRole.name)
      .set('Authorization', 'Bearer ' + userAccessToken)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('/POST /user/v1/delete (Fail delete of user with role "administrator")', async () => {
    const admin = await userService.findUserByEmailOrPhone(adminEmail);
    return request(app.getHttpServer())
      .post('/user/v1/delete/' + admin.uuid)
      .set('Authorization', 'Bearer ' + userAccessToken)
      .send({ name: 'admin' })
      .expect(403);
  });

  it('/POST /user/v1/create (Fail existing email creation)', done => {
    const userReq = {
      roles: ['administrator'],
      phone: '+919999999999',
      password: 'Br@ndNewP@ss1234',
      name: 'Tester',
      email: adminEmail,
    };
    request(app.getHttpServer())
      .post('/user/v1/create')
      .set('Authorization', 'Bearer ' + userAccessToken)
      .send(userReq)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).toEqual('User already exists');
        if (err) return done(err);
        done();
      });
  });

  it('/POST /user/v1/create (Fail existing phone creation)', done => {
    const userReq = {
      roles: ['administrator'],
      phone: adminPhone,
      password: 'Br@ndNewP@ss1234',
      name: 'Tester',
      email: 'test@user.org',
    };
    request(app.getHttpServer())
      .post('/user/v1/create')
      .set('Authorization', 'Bearer ' + userAccessToken)
      .send(userReq)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).toEqual('User already exists');
        if (err) return done(err);
        done();
      });
  });

  it('/POST /user/v1/create (Create User)', async () => {
    const userReq = {
      roles: [],
      phone: '+919999999999',
      password: 'Br@ndNewP@ss1234',
      name: 'Tester',
      email: 'test@user.org',
    };
    return (
      request(app.getHttpServer())
        .post('/user/v1/create')
        .set('Authorization', 'Bearer ' + userAccessToken)
        .send(userReq)
        .expect(201)
        // delay 500ms before findUserByEmailOrPhone
        // async event may result in error: Invalid User
        .then(delay(500))
        .then(response => {
          return userService.findUserByEmailOrPhone('test@user.org');
        })
        .then(user => (testUser = user))
    );
  });

  it('Validate: Number of User 2, AuthData 2', async () => {
    validateUsersAndAuthData(userService, authDataService, 2, 2);
  });

  it('/POST /user/v1/update (Change Password)', async () => {
    const userReq = {
      roles: [],
      name: 'Tester',
      email: 'test@user.org',
      password: 'Br@ndNewP@ss4321',
    };
    return request(app.getHttpServer())
      .post('/user/v1/update/' + testUser.uuid)
      .set('Authorization', 'Bearer ' + userAccessToken)
      .send(userReq)
      .expect(201);
  });

  it('Validate: Number of User 2, AuthData 2', async () => {
    validateUsersAndAuthData(userService, authDataService, 2, 2);
  });

  it('/POST /settings/v1/update (Update settings)', done => {
    request(app.getHttpServer())
      .post('/settings/v1/update')
      .set('Authorization', 'Bearer ' + userAccessToken)
      .send({
        issuerUrl,
        authCodeExpiresInMinutes: 10,
        communicationServerClientId: clientId,
      })
      .expect(201)
      .end((error, response) => {
        if (error) done(error);
        done();
      });
  });

  it('/POST /user/v1/change_password (Self change password)', done => {
    request(app.getHttpServer())
      .post('/user/v1/change_password')
      .set('Authorization', 'Bearer ' + userAccessToken)
      .send({ currentPassword: adminPassword, newPassword: '14Ch@rPassword' })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('/POST /user/v1/delete_me (Delete Me)', done => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'test@user.org',
        password: 'Br@ndNewP@ss4321',
        redirect: '/account',
      })
      .end((err, res) => {
        if (err) return done(err);
        const authRequest = `/oauth2/confirmation?scope=${allowedScopes.join(
          '%20',
        )}&response_type=token&client_id=${clientId}&redirect_uri=${
          redirectUris[0]
        }&state=420`;
        const userAuthRequest = request(app.getHttpServer()).get(authRequest);
        userAuthRequest.cookies = res.header['set-cookie'].pop().split(';')[0];
        return userAuthRequest.end((error, response) => {
          if (error) return done(error);
          const accessToken = getParameterByName(
            response.header.location,
            'access_token',
          );
          const deleteMeRequest = request(app.getHttpServer())
            .post('/user/v1/delete_me')
            .set('Authorization', 'Bearer ' + accessToken);
          return deleteMeRequest
            .expect(201)
            .end((deleteError, deleteResponse) => {
              if (deleteError) return done(deleteError);
              done();
            });
        });
      });
  });

  it('Validate: Number of User 1, AuthData 1', async () => {
    validateUsersAndAuthData(userService, authDataService, 1, 1);
  });

  it('Initialize & Verify 2FA', done => {
    request(app.getHttpServer())
      .post('/user/v1/initialize_2fa?restart=true')
      .set('Authorization', 'Bearer ' + userAccessToken)
      .end((err, res) => {
        if (err) return done(err);
        sharedSecret = res.body.key;
        const otp = totp.generate(sharedSecret);
        const verify2faReq = request(app.getHttpServer())
          .post('/user/v1/verify_2fa')
          .send({ otp })
          .set('Authorization', 'Bearer ' + userAccessToken);
        verify2faReq.end((error, response) => {
          if (error) return done(error);
          done();
        });
      });
  });

  it('Validate: Number of User 1, AuthData 2', async () => {
    validateUsersAndAuthData(userService, authDataService, 1, 2);
  });

  it('/POST /auth/login (2FA TOTP Login)', done => {
    const otp = totp.generate(sharedSecret);
    request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: adminEmail,
        password: '14Ch@rPassword',
        code: otp,
        redirect: '/account',
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        Cookies = res.header['set-cookie'].pop().split(';')[0];
        done();
      });
  });

  it('Validate: Number of User 1, AuthData 2', async () => {
    validateUsersAndAuthData(userService, authDataService, 1, 2);
  });

  it('/POST /auth/login (2FA HOTP Login)', async () => {
    return request(app.getHttpServer())
      .post('/auth/verify_password')
      .send({
        username: adminEmail,
        password: '14Ch@rPassword',
      })
      .expect(201)
      .then(loggedIn => {
        return userService.findUserByEmailOrPhone(adminEmail);
      })
      .then(admin => {
        return authDataService.findOne({
          entity: USER,
          entityUuid: admin.uuid,
          authDataType: AuthDataType.LoginOTP,
        });
      })
      .then(otpCounter => {
        const otp = hotp.generate(
          otpCounter.metaData.secret as string,
          Number(otpCounter.metaData.counter),
        );

        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            username: adminEmail,
            password: '14Ch@rPassword',
            code: otp,
            redirect: '/account',
          })
          .expect(200);
      });
  });

  it('Validate: Number of User 1, AuthData 2', async () => {
    validateUsersAndAuthData(userService, authDataService, 1, 2);
  });

  it('/POST /user/v1/disable_2fa (Disable 2FA)', async () => {
    return request(app.getHttpServer())
      .post('/user/v1/disable_2fa')
      .set('Authorization', 'Bearer ' + userAccessToken)
      .expect(201);
  });

  it('Validate: Number of User 1, AuthData 1', async () => {
    validateUsersAndAuthData(userService, authDataService, 1, 1);
  });

  it('/POST /user/v1/forgot_password (Reset Forgotten Password)', async () => {
    return request(app.getHttpServer())
      .post('/user/v1/forgot_password')
      .send({ emailOrPhone: adminEmail })
      .expect(201)
      .then(res => {
        return userService.findUserByEmailOrPhone(adminEmail);
      })
      .then(user => {
        return authDataService.findOne({
          entityUuid: user.uuid,
          authDataType: AuthDataType.VerificationCode,
          entity: USER,
        });
      })
      .then(verificationCode => {
        forgottenPasswordVerificationCode = verificationCode.password;
      });
  });

  it('/POST /user/v1/generate_password (Verify email and set password)', done => {
    request(app.getHttpServer())
      .post('/user/v1/generate_password')
      .set('Authorization', 'Bearer ' + userAccessToken)
      .send({
        verificationCode: forgottenPasswordVerificationCode,
        password: adminPassword,
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('/GET /auth/logout', done => {
    request(app.getHttpServer())
      .get('/auth/logout')
      .expect(302)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  afterAll(async () => {
    await stopServices(app);
  });
});
