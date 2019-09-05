import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import * as speakeasy from 'speakeasy';
import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ExpressServer } from '../src/express-server';
import {
  getParameterByName,
  OIDCKey,
  validateUsersAndAuthData,
} from './e2e-helpers';
import { UserService } from '../src/user-management/entities/user/user.service';
import { OIDCKeyService } from '../src/auth/entities/oidc-key/oidc-key.service';
import { ConfigService } from '../src/config/config.service';
import { KeyPairGeneratorService } from '../src/auth/schedulers';
// import { RoleService } from '../src/user-management/entities/role/role.service';
// import { Role } from '../src/user-management/entities/role/role.interface';
// import { ADMINISTRATOR, SCOPE_EMAIL } from '../src/constants/app-strings';
// import { Scope } from '../src/client-management/entities/scope/scope.interface';
// import { ScopeService } from '../src/client-management/entities/scope/scope.service';
// import { AuthDataType } from '../src/user-management/entities/auth-data/auth-data.interface';
// import { USER } from '../src/user-management/entities/user/user.schema';
import { User } from '../src/user-management/entities/user/user.interface';
import { AuthDataService } from '../src/user-management/entities/auth-data/auth-data.service';
import 'jest';

jest.setTimeout(30000);

describe('AppModule (e2e)', () => {
  let app: INestApplication;
  let moduleFixture;
  let clientId: string;
  let clientSecret: string;
  let redirectUris: string[];
  let allowedScopes: string[];
  let Cookies;
  let code: string;
  let clientAccessToken: string;
  let refreshToken: string;
  let authDataService: AuthDataService;
  // let roleService: RoleService;
  let userService: UserService;
  // let scopeService: ScopeService;
  let codePKCE: string;
  let userAccessToken: string;
  let clientUuid: string;
  // let adminRole: Role;
  // let emailScope: Scope;
  let testUser: User;
  let sharedSecret: string;
  // let forgottenPasswordVerificationCode: string;
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
    authServer.setupSession();
    const keyPairService = moduleFixture.get(KeyPairGeneratorService);
    keyPairService.generateKeyPair = jest.fn(() => Promise.resolve());

    await app.init();
    const oidcKeyService = moduleFixture.get(OIDCKeyService);

    userService = moduleFixture.get(UserService);
    // roleService = moduleFixture.get(RoleService);
    // scopeService = moduleFixture.get(ScopeService);
    authDataService = moduleFixture.get(AuthDataService);

    await oidcKeyService.save(OIDCKey);
  });

  it('/POST /setup', done => {
    return request(app.getHttpServer())
      .post('/setup')
      .send({
        fullName: 'Administrator',
        email: adminEmail,
        infrastructureConsoleUrl: 'http://admin.localhost:5000',
        issuerUrl,
        adminPassword,
        phone: adminPhone,
      })
      .expect(201)
      .end(async (err, res) => {
        if (err) return done(err);
        clientId = res.body.clientId;
        clientSecret = res.body.clientSecret;
        redirectUris = res.body.redirectUris;
        allowedScopes = res.body.allowedScopes;
        // adminRole = await roleService.findOne({ name: ADMINISTRATOR });
        // emailScope = await scopeService.findOne({ name: SCOPE_EMAIL });
        done();
      });
  });

  it('Validate: Number of User 1, AuthData 1', async () => {
    validateUsersAndAuthData(userService, authDataService, 1, 1);
  });

  it('/GET /oauth2/profile (Invalid Token Use)', done => {
    return request(app.getHttpServer())
      .get('/oauth2/profile')
      .set('Authorization', 'Bearer ' + 'fakeToken')
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('/POST /auth/login', done => {
    return request(app.getHttpServer())
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

  it('/POST /oauth2/token (Client Credentials)', done => {
    return request(app.getHttpServer())
      .post('/oauth2/token')
      .send({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUris[0],
        scope: allowedScopes.join(' '),
      })
      .expect(200)
      .then(response => {
        clientAccessToken = response.body.access_token;
        expect(response.body.token_type).toEqual('Bearer');
        done();
      });
  });

  it('/POST /oauth2/introspection (Token Introspection)', done => {
    const clientCredentials = Buffer.from(
      clientId + ':' + clientSecret,
    ).toString('base64');
    return request(app.getHttpServer())
      .post('/oauth2/introspection')
      .send({
        token: clientAccessToken,
      })
      .set('Authorization', 'Basic ' + clientCredentials)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('/GET /oauth2/confirmation (Authorization Code Grant)', done => {
    const authRequest = `/oauth2/confirmation?scope=${allowedScopes.join(
      '%20',
    )}&response_type=code&client_id=${clientId}&redirect_uri=${
      redirectUris[0]
    }&state=420`;
    const req = request(app.getHttpServer()).get(authRequest);
    req.cookies = Cookies;
    return req.end((err, response) => {
      if (err) return done(err);
      code = getParameterByName(response.header.location, 'code');
      const state = getParameterByName(response.header.location, 'state');
      expect(state).toEqual('420');
      done();
    });
  });

  it('/POST /oauth2/token (Code Exchange)', done => {
    const req: any = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUris[0],
      client_id: clientId,
      scope: allowedScopes.join(' '),
    };
    return request(app.getHttpServer())
      .post('/oauth2/token')
      .send(req)
      .expect(200)
      .then(response => {
        userAccessToken = response.body.access_token;
        refreshToken = response.body.refresh_token;
        expect(response.body.token_type).toEqual('Bearer');
        done();
      });
  });

  it('/POST /oauth2/token (Request Owner Password Credentials)', done => {
    return request(app.getHttpServer())
      .post('/oauth2/token')
      .send({
        grant_type: 'password',
        username: adminEmail,
        redirect_uri: redirectUris[0],
        password: adminPassword,
        scope: allowedScopes.join(' '),
        client_id: clientId,
      })
      .expect(200)
      .then(response => {
        expect(response.body.token_type).toEqual('Bearer');
        done();
      });
  });

  it('/GET /oauth2/confirmation (Implicit Grant)', done => {
    const authRequest = `/oauth2/confirmation?scope=${allowedScopes.join(
      '%20',
    )}&response_type=token&client_id=${clientId}&redirect_uri=${
      redirectUris[0]
    }&state=420`;
    const req = request(app.getHttpServer()).get(authRequest);
    req.cookies = Cookies;
    return req.end((err, response) => {
      if (err) return done(err);
      const state = getParameterByName(response.header.location, 'state');
      expect(state).toEqual('420');
      done();
    });
  });

  it('/POST /oauth2/token (Refresh Token Exchange)', done => {
    return request(app.getHttpServer())
      .post('/oauth2/token')
      .send({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        redirect_uri: redirectUris[0],
        scope: allowedScopes.join(' '),
      })
      .expect(200)
      .then(response => {
        expect(response.body.token_type).toEqual('Bearer');
        done();
      });
  });

  it('/GET /oauth2/confirmation (OIDC IDToken Grant)', done => {
    let authRequest = '/oauth2/confirmation?scope=openid';
    authRequest += '&response_type=id_token';
    authRequest += '&client_id=' + clientId;
    authRequest += '&redirect_uri=' + redirectUris[0];
    authRequest += '&state=420&nonce=tHc_Cbd';

    const req = request(app.getHttpServer()).get(authRequest);
    req.cookies = Cookies;
    return req.end((err, response) => {
      if (err) return done(err);
      const oidcIDToken = getParameterByName(
        response.header.location,
        'id_token',
      );
      const state = getParameterByName(response.header.location, 'state');
      expect(state).toEqual('420');
      expect(oidcIDToken).not.toBeNull();
      done();
    });
  });

  it('/GET /oauth2/confirmation (OIDC IDToken Token Grant)', done => {
    let authRequest = '/oauth2/confirmation?scope=openid';
    authRequest += '&response_type=id_token%20token';
    authRequest += '&client_id=' + clientId;
    authRequest += '&redirect_uri=' + redirectUris[0];
    authRequest += '&state=420&nonce=tHc_Cbd';

    const req = request(app.getHttpServer()).get(authRequest);
    req.cookies = Cookies;
    return req.expect(302).end((err, response) => {
      if (err) return done(err);
      const oidcIDToken = getParameterByName(
        response.header.location,
        'id_token',
      );
      const oidcToken = getParameterByName(
        response.header.location,
        'access_token',
      );
      const state = getParameterByName(response.header.location, 'state');
      expect(state).toEqual('420');
      expect(oidcIDToken).not.toBeNull();
      expect(oidcToken).not.toBeNull();
      done();
    });
  });

  it('/GET /oauth2/confirmation (OIDC Code IDToken Grant)', done => {
    let authRequest = '/oauth2/confirmation?scope=openid';
    authRequest += '&response_type=code%20id_token';
    authRequest += '&client_id=' + clientId;
    authRequest += '&redirect_uri=' + redirectUris[0];
    authRequest += '&state=420&nonce=tHc_Cbd';

    const req = request(app.getHttpServer()).get(authRequest);
    req.cookies = Cookies;
    return req.expect(302).end((err, response) => {
      if (err) return done(err);
      const oidcIDToken = getParameterByName(
        response.header.location,
        'id_token',
      );
      const oidcCode = getParameterByName(response.header.location, 'code');
      const state = getParameterByName(response.header.location, 'state');
      expect(state).toEqual('420');
      expect(oidcIDToken).not.toBeNull();
      expect(oidcCode).not.toBeNull();
      done();
    });
  });

  it('/GET /oauth2/confirmation (OIDC Code Token Grant)', done => {
    let authRequest = '/oauth2/confirmation?scope=openid';
    authRequest += '&response_type=code%20token';
    authRequest += '&client_id=' + clientId;
    authRequest += '&redirect_uri=' + redirectUris[0];
    authRequest += '&state=420&nonce=tHc_Cbd';

    const req = request(app.getHttpServer()).get(authRequest);
    req.cookies = Cookies;
    return req.expect(302).end((err, response) => {
      if (err) return done(err);
      const oidcToken = getParameterByName(
        response.header.location,
        'access_token',
      );
      const oidcCode = getParameterByName(response.header.location, 'code');
      const state = getParameterByName(response.header.location, 'state');
      expect(state).toEqual('420');
      expect(oidcToken).not.toBeNull();
      expect(oidcCode).not.toBeNull();
      done();
    });
  });

  it('/GET /oauth2/confirmation (OIDC Code IDToken Token Grant)', done => {
    let authRequest = '/oauth2/confirmation?scope=openid';
    authRequest += '&response_type=code%20id_token%20token';
    authRequest += '&client_id=' + clientId;
    authRequest += '&redirect_uri=' + redirectUris[0];
    authRequest += '&state=420&nonce=tHc_Cbd';

    const req = request(app.getHttpServer()).get(authRequest);
    req.cookies = Cookies;
    return req.expect(302).end((err, response) => {
      if (err) return done(err);
      const oidcToken = getParameterByName(
        response.header.location,
        'access_token',
      );
      const oidcCode = getParameterByName(response.header.location, 'code');
      const oidcIDToken = getParameterByName(
        response.header.location,
        'id_token',
      );
      const state = getParameterByName(response.header.location, 'state');
      expect(state).toEqual('420');
      expect(oidcIDToken).not.toBeNull();
      expect(oidcToken).not.toBeNull();
      expect(oidcCode).not.toBeNull();
      done();
    });
  });

  it('/GET /oauth2/confirmation (Authorization Code Grant PKCE)', done => {
    const authRequest = `/oauth2/confirmation?scope=${allowedScopes.join(
      '%20',
    )}&response_type=code&client_id=${clientId}&redirect_uri=${
      redirectUris[0]
    }&state=420&code_challenge_method=S256&code_challenge=21XaP8MJjpxCMRxgEzBP82sZ73PRLqkyBUta1R309J0`;
    const req = request(app.getHttpServer()).get(authRequest);
    req.cookies = Cookies;
    return req.end((err, response) => {
      if (err) return done(err);
      codePKCE = getParameterByName(response.header.location, 'code');
      const state = getParameterByName(response.header.location, 'state');
      expect(state).toEqual('420');
      done();
    });
  });

  it('/POST /oauth2/token (Code Exchange PKCE)', done => {
    const req: any = {
      grant_type: 'authorization_code',
      code: codePKCE,
      redirect_uri: redirectUris[0],
      client_id: clientId,
      scope: allowedScopes.join(' '),
      code_verifier: '420',
    };
    return request(app.getHttpServer())
      .post('/oauth2/token')
      .send(req)
      .expect(200)
      .then(response => {
        refreshToken = response.body.refresh_token;
        expect(response.body.token_type).toEqual('Bearer');
        done();
      });
  });

  it('/POST /client/v1/create (Create Client)', done => {
    const clientReq = {
      allowedScopes: ['openid', 'email', 'roles', 'profile'],
      authenticationMethod: 'PUBLIC_CLIENT',
      autoApprove: true,
      isTrusted: '1',
      name: 'E2E Test Client',
      redirectUris: ['http://e2e.localhost:3000/index.html'],
    };
    return request(app.getHttpServer())
      .post('/client/v1/create')
      .set('Authorization', 'Bearer ' + userAccessToken)
      .send(clientReq)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('/GET /client/v1/list (List Clients)', done => {
    return request(app.getHttpServer())
      .get('/client/v1/list')
      .set('Authorization', 'Bearer ' + userAccessToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.docs).toHaveLength(2);
        expect(res.body.length).toEqual(2);
        if (err) return done(err);
        done();
      });
  });

  it('/GET /client/v1/get_by_client_id (Retrieve Client)', done => {
    return request(app.getHttpServer())
      .get('/client/v1/get_by_client_id/' + clientId)
      .set('Authorization', 'Bearer ' + userAccessToken)
      .expect(200)
      .end((err, res) => {
        clientUuid = res.body.uuid;
        expect(res.body.clientId).toEqual(clientId);
        if (err) return done(err);
        done();
      });
  });

  it('/GET /client/v1/get (Retrieve Client by UUID)', done => {
    return request(app.getHttpServer())
      .get('/client/v1/get/' + clientUuid)
      .set('Authorization', 'Bearer ' + userAccessToken)
      .expect(200)
      .end((err, res) => {
        expect(res.body.clientId).toEqual(clientId);
        expect(res.body.uuid).toEqual(clientUuid);
        if (err) return done(err);
        done();
      });
  });

  it('/POST /role/v1/create (Fail to add Role with existing name)', done => {
    return request(app.getHttpServer())
      .post('/role/v1/create')
      .set('Authorization', 'Bearer ' + userAccessToken)
      .send({ name: 'administrator' })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  // it('/POST /role/v1/update (Fail update of user used role name)', done => {
  //   return request(app.getHttpServer())
  //     .post('/role/v1/update/' + adminRole.uuid)
  //     .set('Authorization', 'Bearer ' + userAccessToken)
  //     .send({ name: 'admin' })
  //     .expect(400)
  //     .end((err, res) => {
  //       if (err) return done(err);
  //       done();
  //     });
  // });

  // it('/POST /role/v1/delete (Fail delete of user used role name)', done => {
  //   return request(app.getHttpServer())
  //     .post('/role/v1/delete/' + adminRole.name)
  //     .set('Authorization', 'Bearer ' + userAccessToken)
  //     .expect(400)
  //     .end((err, res) => {
  //       if (err) return done(err);
  //       done();
  //     });
  // });

  it('/POST /user/v1/delete (Fail delete of user with role "administrator")', async () => {
    const admin = await userService.findUserByEmailOrPhone(adminEmail);
    return request(app.getHttpServer())
      .post('/user/v1/delete/' + admin.uuid)
      .set('Authorization', 'Bearer ' + userAccessToken)
      .send({ name: 'admin' })
      .expect(403);
  });

  // it('/POST /user/v1/create (Fail existing email creation)', done => {
  //   const userReq = {
  //     roles: ['administrator'],
  //     phone: '+919999999999',
  //     password: 'Br@ndNewP@ss1234',
  //     name: 'Tester',
  //     email: adminEmail,
  //   };
  //   return request(app.getHttpServer())
  //     .post('/user/v1/create')
  //     .set('Authorization', 'Bearer ' + userAccessToken)
  //     .send(userReq)
  //     .expect(400)
  //     .end((err, res) => {
  //       expect(res.body.message).toEqual('User already exists');
  //       if (err) return done(err);
  //       done();
  //     });
  // });

  // it('/POST /user/v1/create (Fail existing phone creation)', done => {
  //   const userReq = {
  //     roles: ['administrator'],
  //     phone: adminPhone,
  //     password: 'Br@ndNewP@ss1234',
  //     name: 'Tester',
  //     email: 'test@user.org',
  //   };
  //   return request(app.getHttpServer())
  //     .post('/user/v1/create')
  //     .set('Authorization', 'Bearer ' + userAccessToken)
  //     .send(userReq)
  //     .expect(400)
  //     .end((err, res) => {
  //       expect(res.body.message).toEqual('User already exists');
  //       if (err) return done(err);
  //       done();
  //     });
  // });

  it('/POST /user/v1/create (Create User)', async () => {
    const userReq = {
      roles: [],
      phone: '+919999999999',
      password: 'Br@ndNewP@ss1234',
      name: 'Tester',
      email: 'test@user.org',
    };
    return request(app.getHttpServer())
      .post('/user/v1/create')
      .set('Authorization', 'Bearer ' + userAccessToken)
      .send(userReq)
      .expect(201)
      .then(response => {
        return userService.findUserByEmailOrPhone('test@user.org');
      })
      .then(user => (testUser = user));
  });

  // it('Validate: Number of User 2, AuthData 2', async () => {
  //   validateUsersAndAuthData(userService, authDataService, 2, 2);
  // });

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

  // it('Validate: Number of User 2, AuthData 2', async () => {
  //   validateUsersAndAuthData(userService, authDataService, 2, 2);
  // });

  it('/POST /scope/v1/create (Fail to add Scope with existing name)', done => {
    return request(app.getHttpServer())
      .post('/scope/v1/create')
      .set('Authorization', 'Bearer ' + userAccessToken)
      .send({ name: 'email' })
      .expect(403)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  // it('/POST /scope/v1/update (Fail update of client used scope name)', done => {
  //   return request(app.getHttpServer())
  //     .post('/scope/v1/update/' + emailScope.uuid)
  //     .set('Authorization', 'Bearer ' + userAccessToken)
  //     .send({ name: 'email_address' })
  //     .expect(400)
  //     .end((err, res) => {
  //       expect(res.body.existingClientsWithScope.length).toBeGreaterThan(0);
  //       if (err) return done(err);
  //       done();
  //     });
  // });

  // it('/POST /scope/v1/delete (Fail delete of client used scope name)', done => {
  //   return request(app.getHttpServer())
  //     .post('/scope/v1/delete/' + emailScope.name)
  //     .set('Authorization', 'Bearer ' + userAccessToken)
  //     .send({ name: 'admin' })
  //     .expect(400)
  //     .end((err, res) => {
  //       expect(res.body.cannotDeleteScope).toEqual(emailScope.name);
  //       if (err) return done(err);
  //       done();
  //     });
  // });

  it('/POST /settings/v1/update (Update settings)', done => {
    return request(app.getHttpServer())
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
    return request(app.getHttpServer())
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
    return request(app.getHttpServer())
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

  // it('Validate: Number of User 1, AuthData 1', async () => {
  //   validateUsersAndAuthData(userService, authDataService, 1, 1);
  // });

  it('Initialize & Verify 2FA', done => {
    return request(app.getHttpServer())
      .post('/user/v1/initialize_2fa?restart=true')
      .set('Authorization', 'Bearer ' + userAccessToken)
      .end((err, res) => {
        if (err) return done(err);
        sharedSecret = res.body.key;
        const otp = speakeasy.totp({
          secret: sharedSecret,
          encoding: 'base32',
        });
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

  // it('Validate: Number of User 1, AuthData 2', async () => {
  //   validateUsersAndAuthData(userService, authDataService, 1, 2);
  // });

  it('/POST /auth/login (2FA TOTP Login)', done => {
    const otp = speakeasy.totp({
      secret: sharedSecret,
      encoding: 'base32',
    });
    return request(app.getHttpServer())
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

  // it('Validate: Number of User 1, AuthData 2', async () => {
  //   validateUsersAndAuthData(userService, authDataService, 1, 2);
  // });

  // it('/POST /auth/login (2FA HOTP Login)', async () => {
  //   return request(app.getHttpServer())
  //     .post('/auth/verify_password')
  //     .send({
  //       username: adminEmail,
  //       password: '14Ch@rPassword',
  //     })
  //     .expect(201)
  //     .then(loggedIn => {
  //       return userService.findUserByEmailOrPhone(adminEmail);
  //     })
  //     .then(admin => {
  //       return authDataService.findOne({
  //         entity: USER,
  //         entityUuid: admin.uuid,
  //         authDataType: AuthDataType.LoginOTP,
  //       });
  //     })
  //     .then(otpCounter => {
  //       const otp = speakeasy.hotp({
  //         secret: sharedSecret,
  //         encoding: 'base32',
  //         counter: otpCounter.password,
  //       });

  //       return request(app.getHttpServer())
  //         .post('/auth/login')
  //         .send({
  //           username: adminEmail,
  //           password: '14Ch@rPassword',
  //           code: otp,
  //           redirect: '/account',
  //         })
  //         .expect(200);
  //     });
  // });

  // it('Validate: Number of User 1, AuthData 3', async () => {
  //   validateUsersAndAuthData(userService, authDataService, 1, 3);
  // });

  // it('/POST /user/v1/disable_2fa (Disable 2FA)', async () => {
  //   return request(app.getHttpServer())
  //     .post('/user/v1/disable_2fa')
  //     .set('Authorization', 'Bearer ' + userAccessToken)
  //     .expect(201);
  // });

  // it('Validate: Number of User 1, AuthData 2', async () => {
  //   validateUsersAndAuthData(userService, authDataService, 1, 2);
  // });

  // it('/POST /user/v1/forgot_password (Reset Forgotten Password)', async () => {
  //   return request(app.getHttpServer())
  //     .post('/user/v1/forgot_password')
  //     .send({ emailOrPhone: adminEmail })
  //     .expect(201)
  //     .then(res => {
  //       return userService.findUserByEmailOrPhone(adminEmail);
  //     })
  //     .then(user => {
  //       forgottenPasswordVerificationCode = user.verificationCode;
  //     });
  // });

  // it('/POST /user/v1/generate_password (Verify email and set password)', done => {
  //   return request(app.getHttpServer())
  //     .post('/user/v1/generate_password')
  //     .set('Authorization', 'Bearer ' + userAccessToken)
  //     .send({
  //       verificationCode: forgottenPasswordVerificationCode,
  //       password: adminPassword,
  //     })
  //     .expect(201)
  //     .end((err, res) => {
  //       if (err) return done(err);
  //       done();
  //     });
  // });

  it('/GET /auth/logout', done => {
    return request(app.getHttpServer())
      .get('/auth/logout')
      .expect(302)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
