import { Test } from '@nestjs/testing';
import * as session from 'supertest-session';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/server/app.module';
import { ExpressServer } from '../src/server/express-server';
import { getParameterByName, OIDCKey } from './e2e-helpers';
import { SetupService } from '../src/server/auth/controllers/setup/setup.service';
import { ScopeService } from '../src/server/models/scope/scope.service';
import { UserService } from '../src/server/models/user/user.service';
import { ClientService } from '../src/server/models/client/client.service';
import { SessionService } from '../src/server/models/session/session.service';
import { AuthorizationCodeService } from '../src/server/models/authorization-code/authorization-code.service';
import { BearerTokenService } from '../src/server/models/bearer-token/bearer-token.service';
import { RoleService } from '../src/server/models/role/role.service';
import { ServerSettingsService } from '../src/server/models/server-settings/server-settings.service';
import { OIDCKeyService } from '../src/server/models/oidc-key/oidc-key.service';
import 'jest';
jest.setTimeout(30000);

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
  let refreshToken: string;
  let bearerTokenService;
  let userService;
  const authServer = new ExpressServer();

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(authServer.server);
    authServer.setupSession(app);
    await app.init();

    userService = moduleFixture.get(UserService);
    const setupService = moduleFixture.get(SetupService);
    const authCodeService = moduleFixture.get(AuthorizationCodeService);
    const roleService = moduleFixture.get(RoleService);
    const clientService = moduleFixture.get(ClientService);
    const sessionService = moduleFixture.get(SessionService);
    const scopeService = moduleFixture.get(ScopeService);
    const serverSettingsService = moduleFixture.get(ServerSettingsService);
    const oidcKeyService = moduleFixture.get(OIDCKeyService);

    bearerTokenService = moduleFixture.get(BearerTokenService);

    await bearerTokenService.clear();
    await authCodeService.clear();
    await roleService.clear();

    await sessionService.clear();
    await scopeService.clear();
    await clientService.clear();

    await userService.deleteByEmail('admin@user.org');
    await setupService.createUser(
      'Administrator',
      'admin@user.org',
      '+919876543210',
      'secret',
    );
    const client = await setupService.createClient(
      'admin@user.org',
      'http://localhost:4000',
    );
    clientId = client.clientId;
    clientSecret = client.clientSecret;
    allowedScopes = client.allowedScopes;
    redirectUris = client.redirectUris;

    await oidcKeyService.save(OIDCKey);

    const serverSettings = {
      appURL: 'http://localhost:3000',
    };
    await serverSettingsService.save(serverSettings);

    sessionRequest = session(app.getHttpServer());
  });

  it('/GET /oauth2/profile (Invalid Token Use)', () => {
    return session(app.getHttpServer())
      .get('/oauth2/profile')
      .set('Authorization', 'Bearer ' + 'fakeToken')
      .expect(401);
  });

  it('/POST /auth/login', () => {
    return sessionRequest
      .post('/auth/login')
      .send({
        username: 'admin@user.org',
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
        done();
      });
  });

  it('/POST /oauth2/introspection (Token Introspection)', done => {
    const clientCredentials = Buffer.from(
      clientId + ':' + clientSecret,
    ).toString('base64');
    return session(app.getHttpServer())
      .post('/oauth2/introspection')
      .send({
        token: clientAccessToken,
      })
      .set('Authorization', 'Basic ' + clientCredentials)
      .expect(200)
      .then(res => {
        done();
      });
  });

  it('/GET /oauth2/confirmation (Authorization Code Grant)', done => {
    const request = `/oauth2/confirmation?scope=${allowedScopes.toString()}&response_type=code&client_id=${clientId}&redirect_uri=${
      redirectUris[0]
    }&state=420`;
    return sessionRequest.get(request).then(response => {
      code = getParameterByName(response.headers.location, 'code');
      const state = getParameterByName(response.headers.location, 'state');
      expect(state).toEqual('420');
      done();
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
        refreshToken = response.body.refresh_token;
        expect(response.body.token_type).toEqual('Bearer');
        done();
      });
  });

  it('/POST /oauth2/token (Request Owner Password Credentials)', done => {
    return session(app.getHttpServer())
      .post('/oauth2/token')
      .send({
        grant_type: 'password',
        username: 'admin@user.org',
        redirect_uri: redirectUris[0],
        password: 'secret',
        scope: allowedScopes.toString(),
        client_id: clientId,
      })
      .expect(200)
      .then(response => {
        expect(response.body.token_type).toEqual('Bearer');
        done();
      });
  });

  it('/GET /oauth2/confirmation (Implicit Grant)', done => {
    const request = `/oauth2/confirmation?scope=${allowedScopes.toString()}&response_type=token&client_id=${clientId}&redirect_uri=${
      redirectUris[0]
    }&state=420`;
    return sessionRequest.get(request).then(response => {
      const state = getParameterByName(response.headers.location, 'state');
      expect(state).toEqual('420');
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
        done();
      });
  });

  it('/GET /oauth2/confirmation (OIDC IDToken Grant)', done => {
    const request = `/oauth2/confirmation?scope=openid&response_type=id_token&client_id=${clientId}&redirect_uri=${
      redirectUris[0]
    }&state=420&nonce=tHc_Cbd`;
    return sessionRequest.get(request).then(response => {
      const oidcIDToken = getParameterByName(
        response.headers.location,
        'id_token',
      );
      const state = getParameterByName(response.headers.location, 'state');
      expect(state).toEqual('420');
      expect(oidcIDToken).not.toBeNull();
      done();
    });
  });

  it('/GET /oauth2/confirmation (OIDC IDToken Token Grant)', done => {
    const request = `/oauth2/confirmation?scope=openid&response_type=id_token%20token&client_id=${clientId}&redirect_uri=${
      redirectUris[0]
    }&state=420&nonce=tHc_Cbd`;
    return sessionRequest
      .get(request)
      .expect(302)
      .then(response => {
        const oidcIDToken = getParameterByName(
          response.headers.location,
          'id_token',
        );
        const oidcToken = getParameterByName(
          response.headers.location,
          'access_token',
        );
        const state = getParameterByName(response.headers.location, 'state');
        expect(state).toEqual('420');
        expect(oidcIDToken).not.toBeNull();
        expect(oidcToken).not.toBeNull();
        done();
      });
  });

  it('/GET /oauth2/confirmation (OIDC Code IDToken Grant)', done => {
    const request = `/oauth2/confirmation?scope=openid&response_type=code%20id_token&client_id=${clientId}&redirect_uri=${
      redirectUris[0]
    }&state=420&nonce=tHc_Cbd`;
    return sessionRequest
      .get(request)
      .expect(302)
      .then(response => {
        const oidcIDToken = getParameterByName(
          response.headers.location,
          'id_token',
        );
        const oidcCode = getParameterByName(response.headers.location, 'code');
        const state = getParameterByName(response.headers.location, 'state');
        expect(state).toEqual('420');
        expect(oidcIDToken).not.toBeNull();
        expect(oidcCode).not.toBeNull();
        done();
      });
  });

  it('/GET /oauth2/confirmation (OIDC Code Token Grant)', done => {
    const request = `/oauth2/confirmation?scope=openid&response_type=code%20token&client_id=${clientId}&redirect_uri=${
      redirectUris[0]
    }&state=420&nonce=tHc_Cbd`;
    return sessionRequest
      .get(request)
      .expect(302)
      .then(response => {
        const oidcToken = getParameterByName(
          response.headers.location,
          'access_token',
        );
        const oidcCode = getParameterByName(response.headers.location, 'code');
        const state = getParameterByName(response.headers.location, 'state');
        expect(state).toEqual('420');
        expect(oidcToken).not.toBeNull();
        expect(oidcCode).not.toBeNull();
        done();
      });
  });

  it('/GET /oauth2/confirmation (OIDC Code IDToken Token Grant)', done => {
    const request = `/oauth2/confirmation?scope=openid&response_type=code%20id_token%20token&client_id=${clientId}&redirect_uri=${
      redirectUris[0]
    }&state=420&nonce=tHc_Cbd`;
    return sessionRequest
      .get(request)
      .expect(302)
      .then(response => {
        const oidcToken = getParameterByName(
          response.headers.location,
          'access_token',
        );
        const oidcCode = getParameterByName(response.headers.location, 'code');
        const oidcIDToken = getParameterByName(
          response.headers.location,
          'id_token',
        );
        const state = getParameterByName(response.headers.location, 'state');
        expect(state).toEqual('420');
        expect(oidcIDToken).not.toBeNull();
        expect(oidcToken).not.toBeNull();
        expect(oidcCode).not.toBeNull();
        done();
      });
  });

  afterAll(async () => {
    await bearerTokenService.clear();
    await userService.deleteByEmail('admin@user.org');
    await app.close();
  });
});
