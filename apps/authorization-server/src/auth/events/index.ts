import { SocialLoginRemovedHandler } from './social-login-removed/social-login-removed.handler';
import { BearerTokenRemovedHandler } from './bearer-token-removed/bearer-token-removed.handler';
import { UserSignedUpViaSocialLoginHandler } from './social-login-user-signed-up/social-login-user-signed-up.handler';

export const AuthEventHandlers = [
  SocialLoginRemovedHandler,
  BearerTokenRemovedHandler,
  UserSignedUpViaSocialLoginHandler,
];

export {
  SocialLoginUserSignedUpEvent,
} from './social-login-user-signed-up/social-login-user-signed-up.event';
