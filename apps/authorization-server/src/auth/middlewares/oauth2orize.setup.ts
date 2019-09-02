import { Injectable, OnModuleInit } from '@nestjs/common';
import * as oauth2orize from 'oauth2orize';
import * as openidConnect from 'oauth2orize-openid';
import * as pkce from 'oauth2orize-pkce';
import { ClientService } from '../../client-management/entities/client/client.service';
import { BearerTokenService } from '../entities/bearer-token/bearer-token.service';
import { invalidClientException } from '../../common/filters/exceptions';
import { TokenGrantService } from '../oauth2/token-grant/token-grant.service';
import { CodeExchangeService } from '../oauth2/code-exchange/code-exchange.service';
import { PasswordExchangeService } from '../oauth2/password-exchange/password-exchange.service';
import { ClientCredentialExchangeService } from '../oauth2/client-credential-exchange/client-credential-exchange.service';
import { RefreshTokenExchangeService } from '../oauth2/refresh-token-exchange/refresh-token-exchange.service';
import { IDTokenGrantService } from '../oauth2/id-token-grant/id-token-grant.service';
import { CodeGrantService } from '../oauth2/code-grant/code-grant.service';
import { codeNonceExtension } from '../oauth2/custom-extensions/code-nonce';

@Injectable()
export class OAuth2orizeSetup implements OnModuleInit {
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
    // Setup PKCE
    this.setupPKCE();

    // Setup nonce for code grant
    this.setupCodeGrantNonce();

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

  setupPKCE() {
    this.server.grant(pkce.extensions());
  }

  setupCodeGrantNonce() {
    this.server.grant(codeNonceExtension());
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
        if (client.isTrusted) {
          return done(null, true);
        } else if (client.autoApprove) {
          return done(null, true);
        }

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
      openidConnect.grant.idToken(async (client, user, req, done) => {
        await this.idTokenGrantService.grantIDToken(client, user, req, done);
      }),
    );
  }

  setupIDTokenTokenGrant() {
    this.server.grant(
      openidConnect.grant.idTokenToken(
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
      openidConnect.grant.codeIDToken(
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
      openidConnect.grant.codeToken(
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
      openidConnect.grant.codeIDTokenToken(
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
