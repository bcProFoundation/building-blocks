import { Injectable, OnModuleInit } from '@nestjs/common';
import * as oauth2orize from 'oauth2orize';
import { ClientService } from '../../models/client/client.service';
import { AuthorizationCodeService } from '../../models/authorization-code/authorization-code.service';
import { CryptographerService } from '../../utilities/cryptographer.service';
import { BearerTokenService } from '../../models/bearer-token/bearer-token.service';
import { UserService } from '../../models/user/user.service';

@Injectable()
export class OAuth2orizeSetup implements OnModuleInit {
  onModuleInit() {
    // Serialize Client
    this.server.serializeClient((client, done) => done(null, client.id));

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
  public server;
  constructor(
    private readonly authorizationCodeService: AuthorizationCodeService,
    private readonly cryptographerService: CryptographerService,
    private readonly clientService: ClientService,
    private readonly bearerTokenService: BearerTokenService,
    private readonly userService: UserService,
  ) {
    // Initialize server
    this.server = oauth2orize.createServer();
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
      oauth2orize.grant.code(async (client, redirectUri, user, ares, done) => {
        try {
          const code = this.cryptographerService.getUid(16);
          const localClient = await this.clientService.findOne(client.id);
          const localUser = await this.userService.findOne(user);
          await this.authorizationCodeService.save({
            code,
            client: localClient,
            redirectUri,
            user: localUser,
            userKey: localUser.id,
            clientKey: localClient.id,
          });
          done(null, code);
        } catch (error) {
          done(error, null);
        }
      }),
    );
  }

  setupTokenGrant() {
    this.server.grant(
      oauth2orize.grant.token(async (client, user, ares, done) => {
        try {
          const localUser = await this.userService.findOne(user);
          const [bearerToken, extraParams] = await this.getBearerToken(
            client,
            localUser,
            false,
          );
          return done(null, bearerToken.accessToken);
        } catch (error) {
          return done(error);
        }
      }),
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
            if (!localCode) issued(null);
            const [bearerToken, extraParams] = await this.getBearerToken(
              localCode.client,
              localCode.user,
            );
            await this.authorizationCodeService.remove(localCode);
            issued(
              null,
              bearerToken.accessToken,
              bearerToken.refreshToken,
              extraParams,
            );
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
        async (client, username, password, scope, done) => {
          // Validate the client
          try {
            const localClient = await this.clientService.findOne(client.id);
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

            // TODO: Validate Scopes
            // Everything validated, return the token
            const [bearerToken, extraParams] = await this.getBearerToken(
              localClient,
              user,
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
      oauth2orize.exchange.clientCredentials(async (client, scope, done) => {
        // Validate the client
        try {
          const c = await this.clientService.findOne(client.id);
          if (!c) done(null, false);
          if (c.clientSecret !== client.clientSecret) return done(null, false);
          // TODO: Validate Scope

          // Everything validated, return the token
          // Pass in a null for user id since there is no user with this grant type
          const [bearerToken, extraParams] = await this.getBearerToken(
            client,
            null,
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
      }),
    );
  }

  setupRefreshTokenExchange() {
    this.server.exchange(
      oauth2orize.exchange.refreshToken(async (client, refreshToken, done) => {
        try {
          // Validate Refresh Token
          const localRefreshToken = await this.bearerTokenService.findOne({
            refreshToken,
          });
          if (!localRefreshToken) done(null, false);

          // Validate Client
          if (client) {
            const localClient = await this.clientService.findOne(client.id);
            if (!localClient) done(null, false);
          } else {
            client = localRefreshToken.client;
          }

          // Everything validated, return the token

          const [bearerToken, extraParams] = await this.getBearerToken(
            client,
            localRefreshToken.user,
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
      }),
    );
  }

  getCodeGrantMiddleware() {
    return this.server.authorization(
      async (clientId, redirectUri, done) => {
        try {
          const localClient = await this.clientService.findOne(clientId);
          if (localClient.redirectUri !== redirectUri)
            return done(null, false, false);
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
              user: { id: user.id },
              client: { id: client.id },
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

  async getBearerToken(client, user, refresh = true) {
    const bearerToken: any = {
      accessToken: this.cryptographerService.getUid(64),
      redirectUri: client.redirectUri,
      client,
    };

    if (refresh)
      bearerToken.refreshToken = this.cryptographerService.getUid(64);
    if (user) bearerToken.user = user;

    const extraParams: any = {
      scope: 'all',
      expires_in: 3600,
    };

    bearerToken.scope = extraParams.scope;
    bearerToken.expiresIn = extraParams.expires_in;

    await this.bearerTokenService.save(bearerToken);

    return [bearerToken, extraParams];
  }
}
