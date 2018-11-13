import {
  Injectable,
  OnModuleInit,
  OnApplicationBootstrap,
} from '@nestjs/common';
import * as oauth2orize from 'oauth2orize';
import * as oauth2orize_ext from 'oauth2orize-openid';
import { ClientService } from '../../models/client/client.service';
import { BearerTokenService } from '../../models/bearer-token/bearer-token.service';
import { invalidClientException } from '../filters/exceptions';
import { CodeGrantService } from '../oauth2-services/code-grant/code-grant.service';
import { TokenGrantService } from '../oauth2-services/token-grant/token-grant.service';
import { CodeExchangeService } from '../oauth2-services/code-exchange/code-exchange.service';
import { PasswordExchangeService } from '../oauth2-services/password-exchange/password-exchange.service';
import { ClientCredentialExchangeService } from '../oauth2-services/client-credential-exchange/client-credential-exchange.service';
import { RefreshTokenExchangeService } from '../oauth2-services/refresh-token-exchange/refresh-token-exchange.service';
import { IDTokenGrantService } from '../oauth2-services/id-token-grant/id-token-grant.service';

@Injectable()
export class OAuth2orizeSetup implements OnModuleInit, OnApplicationBootstrap {
  public server;
  constructor(
    private readonly clientService: ClientService,
    private readonly bearerTokenService: BearerTokenService,
    private readonly codeGrantService: CodeGrantService,
    private readonly tokenGrantService: TokenGrantService,
    private readonly codeExchangeService: CodeExchangeService,
    private readonly passwordExchangeService: PasswordExchangeService,
    private readonly clientCredentialExchangeService: ClientCredentialExchangeService,
    private readonly refreshTokenExchangeService: RefreshTokenExchangeService,
    private readonly idTokenGrantService: IDTokenGrantService,
  ) {
    // Initialize server
    this.server = oauth2orize.createServer();
  }

  onApplicationBootstrap() {} // App boot fails if not implemented

  onModuleInit() {
    // Serialize Client
    this.server.serializeClient((client, done) => done(null, client.clientId));

    // Deserialize Client
    this.server.deserializeClient(async (id, done) => {
      try {
        const client = await this.clientService.findOne({ clientId: id });
        done(null, client);
      } catch (error) {
        done(error, null);
      }
    });

    this.setupServer();
  }

  setupServer() {
    // Setup Authorization Code Grant
    this.setupCodeGrant();

    // Setup Token Exchange (Implicit Grant)
    this.setupTokenGrant();

    // Setup Code Exchange
    this.setupCodeExchange();

    // Setup Password Exchange
    this.setupPasswordExchange();

    // Setup Client Credential Exchange
    this.setupClientCredentialExchange();

    // Setup Refresh Token Exchange
    this.setupRefreshTokenExchange();

    // Setup OIDC Grants
    this.setupIDTokenGrant();
    this.setupIDTokenTokenGrant();
    this.setupCodeIDTokenGrant();
    this.setupCodeTokenGrant();
    this.setupCodeIdTokenTokenGrant();
  }

  setupCodeGrant() {
    this.server.grant(
      oauth2orize.grant.code(
        { scopeSeparator: [' ', ','] }, // violates the specification, promote flexibility
        async (client, redirectUri, user, ares, areq, done) => {
          await this.codeGrantService.grantCode(
            client,
            redirectUri,
            user,
            ares,
            areq,
            done,
          );
        },
      ),
    );
  }

  setupTokenGrant() {
    this.server.grant(
      oauth2orize.grant.token(
        { scopeSeparator: [' ', ','] }, // violates the specification, promote flexibility
        async (client, user, ares, areq, done) => {
          await this.tokenGrantService.grantToken(
            client,
            user,
            ares,
            areq,
            done,
          );
        },
      ),
    );
  }

  setupCodeExchange() {
    this.server.exchange(
      oauth2orize.exchange.code(
        async (client, code, redirectUri, body, issued) => {
          await this.codeExchangeService.exchangeCode(
            client,
            code,
            redirectUri,
            body,
            issued,
          );
        },
      ),
    );
  }

  setupPasswordExchange() {
    this.server.exchange(
      oauth2orize.exchange.password(
        { scopeSeparator: [' ', ','] }, // violates the specification, promote flexibility
        async (client, username, password, scope, done) => {
          await this.passwordExchangeService.exchangePassword(
            client,
            username,
            password,
            scope,
            done,
          );
        },
      ),
    );
  }

  setupClientCredentialExchange() {
    this.server.exchange(
      oauth2orize.exchange.clientCredentials(
        { scopeSeparator: [' ', ','] }, // violates the specification, promote flexibility
        async (client, scope, done) => {
          await this.clientCredentialExchangeService.exchangeClientCredentials(
            client,
            scope,
            done,
          );
        },
      ),
    );
  }

  setupRefreshTokenExchange() {
    this.server.exchange(
      oauth2orize.exchange.refreshToken(
        { scopeSeparator: [' ', ','] }, // violates the specification, promote flexibility
        async (client, refreshToken, done) => {
          await this.refreshTokenExchangeService.exchangeRefreshToken(
            client,
            refreshToken,
            done,
          );
        },
      ),
    );
  }

  getCodeGrantMiddleware() {
    return this.server.authorization(
      async (clientId, redirectUri, done) => {
        try {
          const localClient = await this.clientService.findOne({ clientId });
          if (
            (localClient && !localClient.redirectUris.includes(redirectUri)) ||
            !localClient
          ) {
            return done(invalidClientException, false, false);
          }
          return done(null, localClient, redirectUri);
        } catch (error) {
          return done(error);
        }
      },
      async (client, user, done) => {
        // Check if grant request qualifies for immediate approval
        if (!user) return done(null, false);
        // Auto-approve
        if (client.isTrusted) return done(null, true);

        try {
          // findByUserIdAndClientId
          const tokens = await this.bearerTokenService.find({
            where: {
              user: { uuid: user.uuid },
              client: { clientId: client.clientId },
            },
          });
          // Auto-approve
          if (tokens.length) return done(null, true);
          // Otherwise ask user
          return done(null, false);
        } catch (error) {
          done(error);
        }
      },
    );
  }

  setupIDTokenGrant() {
    this.server.grant(
      oauth2orize_ext.grant.idToken(async (client, user, req, done) => {
        await this.idTokenGrantService.grantIDToken(client, user, req, done);
      }),
    );
  }

  setupIDTokenTokenGrant() {
    this.server.grant(
      oauth2orize_ext.grant.idTokenToken(
        async (client, user, res, req, done) => {
          await this.tokenGrantService.grantToken(client, user, res, req, done);
        },
        async (client, user, req, done) => {
          await this.idTokenGrantService.grantIDToken(
            client,
            user,
            req,
            done,
            this.tokenGrantService.getAccessToken(),
          );
        },
      ),
    );
  }

  setupCodeIDTokenGrant() {
    this.server.grant(
      oauth2orize_ext.grant.codeIDToken(
        async (client, redirectUri, user, res, req, done) => {
          await this.codeGrantService.grantCode(
            client,
            redirectUri,
            user,
            res,
            req,
            done,
          );
        },
        async (client, user, req, done) => {
          await this.idTokenGrantService.grantIDToken(client, user, req, done);
        },
      ),
    );
  }

  setupCodeTokenGrant() {
    this.server.grant(
      oauth2orize_ext.grant.codeToken(
        async (client, user, res, req, done) => {
          await this.tokenGrantService.grantToken(client, user, res, req, done);
        },
        async (client, redirectUri, user, res, req, done) => {
          await this.codeGrantService.grantCode(
            client,
            redirectUri,
            user,
            res,
            req,
            done,
          );
        },
      ),
    );
  }

  setupCodeIdTokenTokenGrant() {
    this.server.grant(
      oauth2orize_ext.grant.codeIDTokenToken(
        async (client, user, res, req, done) => {
          await this.tokenGrantService.grantToken(client, user, res, req, done);
        },
        async (client, redirectUri, user, res, req, done) => {
          await this.codeGrantService.grantCode(
            client,
            redirectUri,
            user,
            res,
            req,
            done,
          );
        },
        async (client, user, req, done) => {
          await this.idTokenGrantService.grantIDToken(client, user, req, done);
        },
      ),
    );
  }
}
