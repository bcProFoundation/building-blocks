import { RemoveSocialLoginHandler } from './remove-social-login/remove-social-login.handler';
import { SendLoginOTPHandler } from './send-login-otp/send-login-otp.handler';
import { RemoveBearerTokenHandler } from './remove-bearer-token/remove-bearer-token.handler';

export const AuthCommandHandlers = [
  RemoveSocialLoginHandler,
  SendLoginOTPHandler,
  RemoveBearerTokenHandler,
];
