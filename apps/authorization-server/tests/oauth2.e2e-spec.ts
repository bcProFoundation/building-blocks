import { Test } from '@nestjs/testing';
import * as session from 'supertest-session';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/server/app.module';
import { setupSession } from '../src/server/setup';
import {
  getParameterByName,
  extractToken,
  introspectToken,
} from './e2e-helpers';
import { SetupService } from '../src/server/auth/controllers/setup/setup.service';
import { ScopeService } from '../src/server/models/scope/scope.service';
import { UserService } from '../src/server/models/user/user.service';
import { ClientService } from '../src/server/models/client/client.service';
import { SessionService } from '../src/server/models/session/session.service';
import { AuthorizationCodeService } from '../src/server/models/authorization-code/authorization-code.service';
import { BearerTokenService } from '../src/server/models/bearer-token/bearer-token.service';
import { RoleService } from '../src/server/models/role/role.service';

describe('OAuth2Controller (e2e)', () => {
  let app: INestApplication;
  let moduleFixture;
  let clientId: string;
  let clientSecret: string;
  let redirectUris: string[];
  let allowedScopes: string[];
  let sessionRequest;
  let code: string;
  let clientAccessToken: string;
  let accessTokenToRevoke: string;
  let refreshToken: string;
  let bearerTokenService;
  let idToken: string;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupSession(app);
    await app.init();

    const userService = moduleFixture.get(UserService);
    const setupService = moduleFixture.get(SetupService);
    const authCodeService = moduleFixture.get(AuthorizationCodeService);
    const roleService = moduleFixture.get(RoleService);
    const clientService = moduleFixture.get(ClientService);
    const sessionService = moduleFixture.get(SessionService);
    const scopeService = moduleFixture.get(ScopeService);

    bearerTokenService = moduleFixture.get(BearerTokenService);
    bearerTokenService.clear();
    authCodeService.clear();
    roleService.clear();

    await sessionService.clear();
    await scopeService.clear();
    await clientService.clear();

    await userService.deleteByEmail('Administrator');
    await setupService.createUser('Administrator', 'Administrator', 'secret');

    const client = await setupService.createClient(
      'Administrator',
      'http://localhost:4000',
    );
    clientId = client.clientId;
    clientSecret = client.clientSecret;
    allowedScopes = client.allowedScopes.map(scope => scope.name);
    redirectUris = client.redirectUris;

    sessionRequest = session(app.getHttpServer());
  });

  it('/GET /oauth2/profile (Invalid Token Use)', () => {
    return session(app.getHttpServer())
      .get('/oauth2/profile')
      .set('Authorization', 'Bearer ' + 'fakeToken')
      .expect(401);
  });

  it('/POST /auth/login', async () => {
    return sessionRequest
      .post('/auth/login')
      .send({
        email: 'Administrator',
        password: 'secret',
        redirect: '/account',
      })
      .expect(200);
  });

  it('/POST /oauth2/token (Client Credentials)', done => {
    return session(app.getHttpServer())
      .post('/oauth2/token')
      .send({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUris[0],
        scope: allowedScopes.toString(),
      })
      .expect(200)
      .then(response => {
        clientAccessToken = response.body.access_token;
        expect(response.body.token_type).toEqual('Bearer');
        introspectToken(
          session(app.getHttpServer()),
          clientAccessToken,
          clientAccessToken,
        );
        done();
      });
  });

  it('/GET /oauth2/confirmation (Authorization Code Grant)', () => {
    const request = `/oauth2/confirmation?scope=${allowedScopes.toString()}&response_type=code&client_id=${clientId}&redirect_uri=${
      redirectUris[0]
    }&state=420`;
    return sessionRequest.get(request).then(response => {
      code = getParameterByName(response.headers.location, 'code');
      const state = getParameterByName(response.headers.location, 'state');
      expect(state).toEqual('420');
    });
  });

  it('/POST /oauth2/token (Code Exchange)', done => {
    const req: any = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUris[0],
      client_id: clientId,
      scope: allowedScopes.toString(),
    };
    return session(app.getHttpServer())
      .post('/oauth2/token')
      .send(req)
      .expect(200)
      .then(response => {
        accessTokenToRevoke = response.body.access_token;
        refreshToken = response.body.refresh_token;
        idToken = response.body.id_token;
        expect(response.body.token_type).toEqual('Bearer');
        introspectToken(sessionRequest, accessTokenToRevoke, clientAccessToken);
        done();
      });
  });

  it('/POST /oauth2/token (Request Owner Password Credentials)', done => {
    return session(app.getHttpServer())
      .post('/oauth2/token')
      .send({
        grant_type: 'password',
        username: 'Administrator',
        redirect_uri: redirectUris[0],
        password: 'secret',
        scope: allowedScopes.toString(),
        client_id: clientId,
      })
      .expect(200)
      .then(response => {
        expect(response.body.token_type).toEqual('Bearer');
        introspectToken(
          session(app.getHttpServer()),
          response.body.access_token,
          clientAccessToken,
        );
        done();
      });
  });

  it('/GET /oauth2/confirmation (Implicit Grant)', done => {
    const request = `/oauth2/confirmation?scope=${allowedScopes.toString()}&response_type=token&client_id=${clientId}&redirect_uri=${
      redirectUris[0]
    }&state=420`;
    return sessionRequest.get(request).then(response => {
      const token = extractToken(response.headers.location);
      const state = getParameterByName(response.headers.location, 'state');
      expect(state).toEqual('420');
      introspectToken(session(app.getHttpServer()), token, clientAccessToken);
      done();
    });
  });

  it('/POST /oauth2/token (Refresh Token Exchange)', done => {
    return sessionRequest
      .post('/oauth2/token')
      .send({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        redirect_uri: redirectUris[0],
        scope: allowedScopes.toString(),
      })
      .expect(200)
      .then(response => {
        expect(response.body.token_type).toEqual('Bearer');
        introspectToken(
          session(app.getHttpServer()),
          response.body.access_token,
          clientAccessToken,
        );
        done();
      });
  });

  afterAll(async () => {
    await bearerTokenService.clear();
    // await getConnection().close();
    setTimeout(await app.close(), 1000);
  });
});
