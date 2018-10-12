import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER, User } from './user/user.schema';
import { UserService } from './user/user.service';
import { SESSION, Session } from './session/session.schema';
import { SessionService } from './session/session.service';
import { UtilitiesModule } from '../utilities/utilities.module';
import { AuthorizationCodeService } from './authorization-code/authorization-code.service';
import {
  AuthorizationCode,
  AUTHORIZATION_CODE,
} from './authorization-code/authorization-code.schema';
import { Client, CLIENT } from './client/client.schema';
import { ClientService } from './client/client.service';
import { BearerToken, BEARER_TOKEN } from './bearer-token/bearer-token.schema';
import { BearerTokenService } from './bearer-token/bearer-token.service';
import { AuthData, AUTH_DATA } from './auth-data/auth-data.schema';
import { AuthDataService } from './auth-data/auth-data.service';
import { ROLE, Role } from './role/role.schema';
import { RoleService } from './role/role.service';
import { SCOPE, Scope } from './scope/scope.schema';
import { ScopeService } from './scope/scope.service';
import {
  SERVER_SETTINGS,
  ServerSettings,
} from './server-settings/server-settings.schema';
import { ServerSettingsService } from './server-settings/server-settings.service';
import { OIDCKey, OIDC_KEY } from './oidc-key/oidc-key.schema';
import { OIDCKeyService } from './oidc-key/oidc-key.service';
import { WellKnownService } from './well-known/well-known.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AUTH_DATA, schema: AuthData },
      { name: AUTHORIZATION_CODE, schema: AuthorizationCode },
      { name: BEARER_TOKEN, schema: BearerToken },
      { name: CLIENT, schema: Client },
      { name: OIDC_KEY, schema: OIDCKey },
      { name: ROLE, schema: Role },
      { name: SCOPE, schema: Scope },
      { name: SERVER_SETTINGS, schema: ServerSettings },
      { name: SESSION, schema: Session },
      { name: USER, schema: User },
    ]),
    UtilitiesModule,
    ConfigModule,
  ],
  providers: [
    AuthDataService,
    AuthorizationCodeService,
    BearerTokenService,
    ClientService,
    RoleService,
    ScopeService,
    SessionService,
    UserService,
    ServerSettingsService,
    WellKnownService,
    OIDCKeyService,
  ],
  exports: [
    AuthDataService,
    AuthorizationCodeService,
    BearerTokenService,
    ClientService,
    RoleService,
    ScopeService,
    SessionService,
    UserService,
    ServerSettingsService,
    WellKnownService,
    OIDCKeyService,
  ],
})
export class ModelsModule {}
