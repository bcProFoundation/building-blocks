import { SocialLoginRemovedHandler } from './social-login-removed/social-login-removed.handler';
import { BearerTokenRemovedHandler } from './bearer-token-removed/bearer-token-removed.handler';
import { UserSignedUpViaSocialLoginHandler } from './social-login-user-signed-up/social-login-user-signed-up.handler';
import { SocialLoginAddedHandler } from './social-login-added/social-login-added.handler';
import { SocialLoginModifiedHandler } from './social-login-modified/social-login-modified.handler';
import { WebAuthnKeyChallengeRequestedHandler } from './webauthn-key-registration-requested/webauthn-key-challenge-requested.handler';
import { WebAuthnKeyRegisteredHandler } from './webauthn-key-registered/webauthn-key-registered.handler';
import { UserLoggedInWithWebAuthnHandler } from './user-logged-in-with-webauthn-key/user-logged-in-with-webauthn-key.handler';
import { UserAuthenticatorRemovedHandler } from './user-authenticator-removed/user-authenticator-removed.handler';
import { UserAuthenticatorModifiedEvent } from './user-authenticator-modified/user-authenticator-modified.event';

export {
  SocialLoginUserSignedUpEvent,
} from './social-login-user-signed-up/social-login-user-signed-up.event';

export const AuthEventHandlers = [
  SocialLoginRemovedHandler,
  BearerTokenRemovedHandler,
  UserSignedUpViaSocialLoginHandler,
  SocialLoginAddedHandler,
  SocialLoginModifiedHandler,
  WebAuthnKeyChallengeRequestedHandler,
  WebAuthnKeyRegisteredHandler,
  UserLoggedInWithWebAuthnHandler,
  UserAuthenticatorRemovedHandler,
  UserAuthenticatorModifiedEvent,
];
