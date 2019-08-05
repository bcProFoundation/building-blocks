import { SocialLoginRemovedHandler } from './social-login-removed/social-login-removed.handler';
import { BearerTokenRemovedHandler } from './bearer-token-removed/bearer-token-removed.handler';

export const AuthEventHandlers = [
  SocialLoginRemovedHandler,
  BearerTokenRemovedHandler,
];
