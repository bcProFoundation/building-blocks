import { RemoveSocialLoginHandler } from './remove-social-login/remove-social-login.handler';
import { SendLoginOTPHandler } from './send-login-otp/send-login-otp.handler';
import { RemoveBearerTokenHandler } from './remove-bearer-token/remove-bearer-token.handler';
import { SignUpSocialLoginUserHandler } from './sign-up-social-login-user/sign-up-social-login-user.handler';
import { AddSocialLoginHandler } from './add-social-login/add-social-login.handler';
import { ModifySocialLoginHandler } from './modify-social-login/modify-social-login.handler';
import { RequestWebAuthnKeyRegistrationHandler } from './request-webauthn-key-registration/request-webauthn-key-registration.handler';
import { WebAuthnRequestLoginHandler } from './webauthn-request-login/webauthn-request-login.handler';
import { RegisterWebAuthnKeyHandler } from './register-webauthn-key/register-webauthn-key.handler';
import { WebAuthnLoginHandler } from './webauthn-login/webauthn-login.handler';
import { RemoveUserAuthenticatorHandler } from './remove-user-authenticator/remove-user-authenticator.handler';
import { RenameUserAuthenticatorHandler } from './rename-user-authenticator/rename-user-authenticator.handler';
import { AddUnverifiedMobileHandler } from './add-unverified-phone/add-unverified-phone.handler';
import { VerifyPhoneHandler } from './verify-phone/verify-phone.handler';
import { GenerateBearerTokenHandler } from './generate-bearer-token/generate-bearer-token.handler';
import { AddUnverifiedEmailHandler } from './add-unverified-email/add-unverified-phone.handler';
import { VerifyEmailHandler } from './verify-email/verify-email.handler';

export const AuthCommandHandlers = [
  RemoveSocialLoginHandler,
  SendLoginOTPHandler,
  RemoveBearerTokenHandler,
  SignUpSocialLoginUserHandler,
  AddSocialLoginHandler,
  ModifySocialLoginHandler,
  RequestWebAuthnKeyRegistrationHandler,
  WebAuthnRequestLoginHandler,
  RegisterWebAuthnKeyHandler,
  WebAuthnLoginHandler,
  RemoveUserAuthenticatorHandler,
  RenameUserAuthenticatorHandler,
  AddUnverifiedMobileHandler,
  VerifyPhoneHandler,
  GenerateBearerTokenHandler,
  AddUnverifiedEmailHandler,
  VerifyEmailHandler,
];
