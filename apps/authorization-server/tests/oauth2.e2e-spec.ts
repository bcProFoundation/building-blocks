import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ExpressServer } from '../src/express-server';
import { getParameterByName, OIDCKey } from './e2e-helpers';
import { SetupService } from '../src/system-settings/controllers/setup/setup.service';
import { ScopeService } from '../src/client-management/entities/scope/scope.service';
import { UserService } from '../src/user-management/entities/user/user.service';
import { ClientService } from '../src/client-management/entities/client/client.service';
import { AuthorizationCodeService } from '../src/auth/entities/authorization-code/authorization-code.service';
import { BearerTokenService } from '../src/auth/entities/bearer-token/bearer-token.service';
import { RoleService } from '../src/user-management/entities/role/role.service';
import { ServerSettingsService } from '../src/system-settings/entities/server-settings/server-settings.service';
import { OIDCKeyService } from '../src/auth/entities/oidc-key/oidc-key.service';
import 'jest';
import { ConfigService } from '../src/config/config.service';
jest.setTimeout(30000);

describe('OAuth2Controller (e2e)', () => {
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
  let bearerTokenService;
  let userService;
  let codePKCE: string;
  const authServer = new ExpressServer(new ConfigService());

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(
      new ExpressAdapter(authServer.server),
    );
    authServer.setupSession();
    await app.init();
    userService = moduleFixture.get(UserService);
    const setupService = moduleFixture.get(SetupService);
    const authCodeService = moduleFixture.get(AuthorizationCodeService);
    const roleService = moduleFixture.get(RoleService);
    const clientService = moduleFixture.get(ClientService);
    const scopeService = moduleFixture.get(ScopeService);
    const serverSettingsService = moduleFixture.get(ServerSettingsService);
    const oidcKeyService = moduleFixture.get(OIDCKeyService);

    bearerTokenService = moduleFixture.get(BearerTokenService);

    await bearerTokenService.clear();
    await authCodeService.clear();
    await roleService.clear();

    await scopeService.clear();
    await clientService.clear();

    await userService.deleteByEmail('admin@user.org');
    await setupService.createUser(
      'Administrator',
      'admin@user.org',
      '+919876543210',
      '14CharP@ssword',
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
        username: 'admin@user.org',
        password: '14CharP@ssword',
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
    const authRequest = `/oauth2/confirmation?scope=${allowedScopes.toString()}&response_type=code&client_id=${clientId}&redirect_uri=${
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
      scope: allowedScopes.toString(),
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

  it('/POST /oauth2/token (Request Owner Password Credentials)', done => {
    return request(app.getHttpServer())
      .post('/oauth2/token')
      .send({
        grant_type: 'password',
        username: 'admin@user.org',
        redirect_uri: redirectUris[0],
        password: '14CharP@ssword',
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
    const authRequest = `/oauth2/confirmation?scope=${allowedScopes.toString()}&response_type=token&client_id=${clientId}&redirect_uri=${
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
        scope: allowedScopes.toString(),
      })
      .expect(200)
      .then(response => {
        expect(response.body.token_type).toEqual('Bearer');
        done();
      });
  });

  it('/GET /oauth2/confirmation (OIDC IDToken Grant)', done => {
    const authRequest = `/oauth2/confirmation?scope=openid&response_type=id_token&client_id=${clientId}&redirect_uri=${
      redirectUris[0]
    }&state=420&nonce=tHc_Cbd`;
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
    const authRequest = `/oauth2/confirmation?scope=openid&response_type=id_token%20token&client_id=${clientId}&redirect_uri=${
      redirectUris[0]
    }&state=420&nonce=tHc_Cbd`;
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
    const authRequest = `/oauth2/confirmation?scope=openid&response_type=code%20id_token&client_id=${clientId}&redirect_uri=${
      redirectUris[0]
    }&state=420&nonce=tHc_Cbd`;
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
    const authRequest = `/oauth2/confirmation?scope=openid&response_type=code%20token&client_id=${clientId}&redirect_uri=${
      redirectUris[0]
    }&state=420&nonce=tHc_Cbd`;
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
    const authRequest = `/oauth2/confirmation?scope=openid&response_type=code%20id_token%20token&client_id=${clientId}&redirect_uri=${
      redirectUris[0]
    }&state=420&nonce=tHc_Cbd`;
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
    const authRequest = `/oauth2/confirmation?scope=${allowedScopes.toString()}&response_type=code&client_id=${clientId}&redirect_uri=${
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
      scope: allowedScopes.toString(),
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

  afterAll(async () => {
    await bearerTokenService.clear();
    await userService.deleteByEmail('admin@user.org');
    await app.close();
  });
});
