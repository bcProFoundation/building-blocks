import { Connection } from 'mongoose';
import {
  AuthorizationCode,
  AUTHORIZATION_CODE,
} from './authorization-code/authorization-code.schema';
import { BearerToken, BEARER_TOKEN } from './bearer-token/bearer-token.schema';
import { OIDCKey, OIDC_KEY } from './oidc-key/oidc-key.schema';
import { SocialLogin, SOCIAL_LOGIN } from './social-login/social-login.schema';
import { Session, SESSION } from './session/session.schema';
import { UserClaim, USER_CLAIM } from './user-claim/user-claim.schema';
import { MONGOOSE_CONNECTION } from '../../common/database.provider';

export const AuthModuleEntities = [
  {
    provide: AUTHORIZATION_CODE,
    useFactory: (connection: Connection) =>
      connection.model(AUTHORIZATION_CODE, AuthorizationCode),
    inject: [MONGOOSE_CONNECTION],
  },
  {
    provide: BEARER_TOKEN,
    useFactory: (connection: Connection) =>
      connection.model(BEARER_TOKEN, BearerToken),
    inject: [MONGOOSE_CONNECTION],
  },
  {
    provide: OIDC_KEY,
    useFactory: (connection: Connection) => connection.model(OIDC_KEY, OIDCKey),
    inject: [MONGOOSE_CONNECTION],
  },
  {
    provide: SOCIAL_LOGIN,
    useFactory: (connection: Connection) =>
      connection.model(SOCIAL_LOGIN, SocialLogin),
    inject: [MONGOOSE_CONNECTION],
  },
  {
    provide: SESSION,
    useFactory: (connection: Connection) => connection.model(SESSION, Session),
    inject: [MONGOOSE_CONNECTION],
  },
  {
    provide: USER_CLAIM,
    useFactory: (connection: Connection) =>
      connection.model(USER_CLAIM, UserClaim),
    inject: [MONGOOSE_CONNECTION],
  },
];
