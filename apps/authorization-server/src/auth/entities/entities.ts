import {
  AuthorizationCode,
  AUTHORIZATION_CODE,
} from './authorization-code/authorization-code.schema';
import { BearerToken, BEARER_TOKEN } from './bearer-token/bearer-token.schema';
import { OIDCKey, OIDC_KEY } from './oidc-key/oidc-key.schema';
import { SocialLogin, SOCIAL_LOGIN } from './social-login/social-login.schema';
import { Session, SESSION } from './session/session.schema';

export const AuthModuleEntities = [
  { name: AUTHORIZATION_CODE, schema: AuthorizationCode },
  { name: BEARER_TOKEN, schema: BearerToken },
  { name: OIDC_KEY, schema: OIDCKey },
  { name: SOCIAL_LOGIN, schema: SocialLogin },
  { name: SESSION, schema: Session },
];
