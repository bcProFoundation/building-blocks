import { Test } from '@nestjs/testing';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import 'jest';

import { AppModule } from '../src/app.module';
import { ExpressServer } from '../src/express-server';
import { getParameterByName, OIDCKey, stopServices } from './e2e-helpers';
import { OIDCKeyService } from '../src/auth/entities/oidc-key/oidc-key.service';
import { ConfigService } from '../src/config/config.service';
import { KeyPairGeneratorService } from '../src/auth/schedulers';
import {
  SCOPE_EMAIL,
  INFRASTRUCTURE_CONSOLE,
} from '../src/constants/app-strings';
import { Scope } from '../src/client-management/entities/scope/scope.interface';
import { ScopeService } from '../src/client-management/entities/scope/scope.service';
import { ClientService } from '../src/client-management/entities/client/client.service';

jest.setTimeout(30000);

describe('AppModule (e2e)', () => {
  let app: INestApplication;
  let moduleFixture;
  let clientId: string;
  let redirectUris: string[];
  let allowedScopes: string[];
  let Cookies;
  let scopeService: ScopeService;
  let clientService: ClientService;
  let userAccessToken: string;
  let clientUuid: string;
  let emailScope: Scope;
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

    scopeService = moduleFixture.get(ScopeService);
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
    emailScope = await scopeService.findOne({ name: SCOPE_EMAIL });
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

  it('/POST /client/v1/create (Create Client)', done => {
    const clientReq = {
      allowedScopes: ['openid', 'email', 'roles', 'profile'],
      authenticationMethod: 'PUBLIC_CLIENT',
      autoApprove: true,
      isTrusted: '1',
      name: 'E2E Test Client',
      redirectUris: ['http://e2e.localhost:3000/index.html'],
    };
    request(app.getHttpServer())
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
    request(app.getHttpServer())
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
    request(app.getHttpServer())
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
    request(app.getHttpServer())
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

  it('/POST /scope/v1/create (Fail to add Scope with existing name)', done => {
    request(app.getHttpServer())
      .post('/scope/v1/create')
      .set('Authorization', 'Bearer ' + userAccessToken)
      .send({ name: 'email' })
      .expect(403)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it('/POST /scope/v1/update (Fail update of client used scope name)', done => {
    request(app.getHttpServer())
      .post('/scope/v1/update/' + emailScope.uuid)
      .set('Authorization', 'Bearer ' + userAccessToken)
      .send({ name: 'email_address' })
      .expect(400)
      .end((err, res) => {
        expect(res.body.existingClientsWithScope.length).toBeGreaterThan(0);
        if (err) return done(err);
        done();
      });
  });

  it('/POST /scope/v1/delete (Fail delete of client used scope name)', done => {
    request(app.getHttpServer())
      .post('/scope/v1/delete/' + emailScope.name)
      .set('Authorization', 'Bearer ' + userAccessToken)
      .send({ name: 'admin' })
      .expect(400)
      .end((err, res) => {
        expect(res.body.cannotDeleteScope).toEqual(emailScope.name);
        if (err) return done(err);
        done();
      });
  });

  afterAll(async () => {
    await stopServices(app);
  });
});
