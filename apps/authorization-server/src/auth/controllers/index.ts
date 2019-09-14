import { OAuth2Controller } from './oauth2/oauth2.controller';
import { AuthController } from './auth/auth.controller';
import { SocialLoginController } from './social-login/social-login.controller';
import { WellKnownController } from './well-known/well-known.controller';
import { AuthService } from './auth/auth.service';
import { OAuth2Service } from './oauth2/oauth2.service';
import { WellKnownService } from './well-known/well-known.service';
import { WebAuthnController } from './webauthn/webauthn.controller';

export const authControllers = [
  AuthController,
  OAuth2Controller,
  SocialLoginController,
  WellKnownController,
  WebAuthnController,
];

export const authServices = [AuthService, OAuth2Service, WellKnownService];
