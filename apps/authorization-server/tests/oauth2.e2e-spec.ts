import 'jest';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';

import { AppModule } from '../src/app.module';
import { ExpressServer } from '../src/express-server';
import { getParameterByName, OIDCKey, stopServices } from './e2e-helpers';
import { OIDCKeyService } from '../src/auth/entities/oidc-key/oidc-key.service';
import { ConfigService } from '../src/config/config.service';
import { KeyPairGeneratorService } from '../src/auth/schedulers';
import { ClientService } from '../src/client-management/entities/client/client.service';
import { INFRASTRUCTURE_CONSOLE } from '../src/constants/app-strings';

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
  let clientService: ClientService;
  let codePKCE: string;
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

    clientSecret = client.clientSecret;
    redirectUris = client.redirectUris;
    allowedScopes = client.allowedScopes;
  });

  it('/GET /oauth2/profile (Invalid Token Use)', done => {
    request(app.getHttpServer())
      .get('/oauth2/profile')
      .set('Authorization', 'Bearer ' + 'fakeToken')
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
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

  it('/POST /oauth2/token (Client Credentials)', done => {
    request(app.getHttpServer())
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
    request(app.getHttpServer())
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

  it('/POST /oauth2/revoke (Revoke Token)', done => {
    const clientCredentials = Buffer.from(
      clientId + ':' + clientSecret,
    ).toString('base64');
    request(app.getHttpServer())
      .post('/oauth2/revoke')
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
    req.end((err, response) => {
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
    request(app.getHttpServer())
      .post('/oauth2/token')
      .send(req)
      .expect(200)
      .then(response => {
        refreshToken = response.body.refresh_token;
        expect(response.body.token_type).toEqual('Bearer');
        done();
      });
  });

  it('/POST /oauth2/token (Request Owner Password Credentials)', done => {
    request(app.getHttpServer())
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
    req.end((err, response) => {
      if (err) return done(err);
      const state = getParameterByName(response.header.location, 'state');
      expect(state).toEqual('420');
      done();
    });
  });

  it('/POST /oauth2/token (Refresh Token Exchange)', done => {
    request(app.getHttpServer())
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
    req.end((err, response) => {
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
    req.expect(302).end((err, response) => {
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
    req.expect(302).end((err, response) => {
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
    req.expect(302).end((err, response) => {
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
    req.expect(302).end((err, response) => {
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
    req.end((err, response) => {
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
    request(app.getHttpServer())
      .post('/oauth2/token')
      .send(req)
      .expect(200)
      .then(response => {
        refreshToken = response.body.refresh_token;
        expect(response.body.token_type).toEqual('Bearer');
        done();
      });
  });

  afterAll(async () => {
    await stopServices(app);
  });
});
