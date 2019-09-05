import { SocialLoginRemovedHandler } from './social-login-removed/social-login-removed.handler';
import { BearerTokenRemovedHandler } from './bearer-token-removed/bearer-token-removed.handler';
import { UserSignedUpViaSocialLoginHandler } from './social-login-user-signed-up/social-login-user-signed-up.handler';
import { SocialLoginAddedHandler } from './social-login-added/social-login-added.handler';
import { SocialLoginModifiedHandler } from './social-login-modified/social-login-modified.handler';

export {
  SocialLoginUserSignedUpEvent,
} from './social-login-user-signed-up/social-login-user-signed-up.event';

export const AuthEventHandlers = [
  SocialLoginRemovedHandler,
  BearerTokenRemovedHandler,
  UserSignedUpViaSocialLoginHandler,
  SocialLoginAddedHandler,
  SocialLoginModifiedHandler,
];
