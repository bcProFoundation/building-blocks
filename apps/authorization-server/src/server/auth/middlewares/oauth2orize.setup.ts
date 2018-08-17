import { Injectable, OnModuleInit } from '@nestjs/common';
import * as oauth2orize from 'oauth2orize';
import { ClientService } from '../../models/client/client.service';
import { AuthorizationCodeService } from '../../models/authorization-code/authorization-code.service';
import { CryptographerService } from '../../utilities/cryptographer.service';
import { BearerTokenService } from '../../models/bearer-token/bearer-token.service';
import { UserService } from '../../models/user/user.service';
import { Client } from '../../models/client/client.entity';
import {
  invalidClientException,
  invalidScopeException,
  invalidAuthorizationCodeException,
} from '../filters/exceptions';
import { OAuth2TokenGeneratorService } from './oauth2-token-generator.service';

@Injectable()
export class OAuth2orizeSetup implements OnModuleInit {
  public server;

  constructor(
    private readonly authorizationCodeService: AuthorizationCodeService,
    private readonly cryptographerService: CryptographerService,
    private readonly clientService: ClientService,
    private readonly bearerTokenService: BearerTokenService,
    private readonly userService: UserService,
    private readonly tokenGeneratorService: OAuth2TokenGeneratorService,
  ) {
    // Initialize server
    this.server = oauth2orize.createServer();
  }

  onModuleInit() {
    // Serialize Client
    this.server.serializeClient((client, done) => done(null, client.clientId));

    // Deserialize Client
    this.server.deserializeClient((id, done) => {
      try {
        const client = this.clientService.findOne(id);
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
  }

  setupCodeGrant() {
    this.server.grant(
      oauth2orize.grant.code(
        { scopeSeparator: [' ', ','] }, // violates the specification, promote flexibility
        async (client, redirectUri, user, ares, areq, done) => {
          try {
            const code = this.cryptographerService.getUid(16);
            const localClient = await this.clientService.findOne({
              clientId: areq.clientID,
            });
            const localUser = await this.userService.findOne({
              email: user.email,
            });
            const scope = await this.tokenGeneratorService.getValidScopes(
              localClient,
              areq.scope,
            );
            await this.authorizationCodeService.save({
              code,
              client: localClient,
              redirectUri,
              user: localUser,
              scope,
            });
            done(null, code);
          } catch (error) {
            done(error, null);
          }
        },
      ),
    );
  }

  setupTokenGrant() {
    this.server.grant(
      oauth2orize.grant.token(
        { scopeSeparator: [' ', ','] }, // violates the specification, promote flexibility
        async (client, user, ares, areq, done) => {
          try {
            const localUser = await this.userService.findOne({
              email: user.email,
            });
            const localClient = await this.clientService.findOne({
              clientId: areq.clientID,
            });
            const scope = await this.tokenGeneratorService.getValidScopes(
              client,
              areq.scope,
            );
            const [
              bearerToken,
              extraParams,
            ] = await this.tokenGeneratorService.getBearerToken(
              localClient,
              localUser,
              scope,
              false,
            );
            return done(null, bearerToken.accessToken, extraParams);
          } catch (error) {
            return done(error);
          }
        },
      ),
    );
  }

  setupCodeExchange() {
    this.server.exchange(
      oauth2orize.exchange.code(
        async (client, code, redirectUri, body, issued) => {
          // Validate the code issued(err, accessToken, refreshToken, params)
          try {
            const localCode = await this.authorizationCodeService.findOne({
              where: { code },
            });

            if (!localCode) {
              issued(invalidAuthorizationCodeException);
            } else {
              const [
                bearerToken,
                extraParams,
              ] = await this.tokenGeneratorService.getBearerToken(
                localCode.client,
                localCode.user,
                localCode.scope,
              );
              await this.authorizationCodeService.delete({ localCode });
              issued(
                null,
                bearerToken.accessToken,
                bearerToken.refreshToken,
                extraParams,
              );
            }
          } catch (error) {
            issued(error);
          }
        },
      ),
    );
  }

  setupPasswordExchange() {
    this.server.exchange(
      oauth2orize.exchange.password(
        { scopeSeparator: [' ', ','] }, // violates the specification, promote flexibility
        async (client, username, password, scope, done) => {
          if (!scope) done(invalidScopeException);
          // Validate the client
          try {
            const localClient = await this.clientService.findOne({
              clientId: client.clientId,
            });
            if (!localClient) return done(null, false);
            if (localClient.clientSecret !== client.clientSecret)
              return done(null, false);
            // Validate the user
            const user = await this.userService.findOne({ email: username });
            if (!user) return done(null, false);
            const authData = await user.password;
            const validPassword = await this.cryptographerService.checkPassword(
              authData.password,
              password,
            );
            if (!validPassword) {
              return done(null, false);
            }

            // Validate Scopes
            const validScope = await this.tokenGeneratorService.getValidScopes(
              localClient,
              scope,
            );
            // Everything validated, return the token
            const [
              bearerToken,
              extraParams,
            ] = await this.tokenGeneratorService.getBearerToken(
              localClient,
              user,
              validScope,
            );
            return done(
              null,
              bearerToken.accessToken,
              bearerToken.refreshToken,
              extraParams,
            );
          } catch (error) {
            return done(error);
          }
        },
      ),
    );
  }

  setupClientCredentialExchange() {
    this.server.exchange(
      oauth2orize.exchange.clientCredentials(
        { scopeSeparator: [' ', ','] }, // violates the specification, promote flexibility
        async (client, scope, done) => {
          if (!scope) done(invalidScopeException);
          // Validate the client
          try {
            const c = await this.clientService.findOne({
              clientId: client.clientId,
            });
            if (!c) done(null, false);
            if (c.clientSecret !== client.clientSecret)
              return done(null, false);
            // Validate Scope
            const validScope = await this.tokenGeneratorService.getValidScopes(
              c,
              scope,
            );
            // Everything validated, return the token
            // Pass in a null for user id since there is no user with this grant type
            const [
              bearerToken,
              extraParams,
            ] = await this.tokenGeneratorService.getBearerToken(
              client,
              null,
              validScope,
              true,
              false,
            );
            return done(
              null,
              bearerToken.accessToken,
              bearerToken.refreshToken,
              extraParams,
            );
          } catch (error) {
            done(error);
          }
        },
      ),
    );
  }

  setupRefreshTokenExchange() {
    this.server.exchange(
      oauth2orize.exchange.refreshToken(
        { scopeSeparator: [' ', ','] }, // violates the specification, promote flexibility
        async (client, refreshToken, done) => {
          try {
            // Validate Refresh Token
            const localRefreshToken = await this.bearerTokenService.findOne({
              refreshToken,
            });
            if (!localRefreshToken) done(null, false);

            // Validate Client
            let localClient: Client;
            if (client) {
              localClient = await this.clientService.findOne({
                clientId: client.clientId,
              });
              if (!localClient) done(null, false);
            } else {
              localClient = localRefreshToken.client;
            }

            // Validate Scopes
            const refreshTokenScope = localRefreshToken.scope.map(s => s.name);
            const scope = await this.tokenGeneratorService.getValidScopes(
              localClient,
              refreshTokenScope,
            );

            // Everything validated, return the token
            const [
              bearerToken,
              extraParams,
            ] = await this.tokenGeneratorService.getBearerToken(
              client,
              localRefreshToken.user,
              scope,
            );
            return done(
              null,
              bearerToken.accessToken,
              bearerToken.refreshToken,
              extraParams,
            );
          } catch (error) {
            done(error);
          }
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
              user: { email: user.email },
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
}
