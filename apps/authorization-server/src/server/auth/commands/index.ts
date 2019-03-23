import { RemoveSocialLoginHandler } from './remove-social-login/remove-social-login.handler';
import { SendLoginOTPHandler } from './send-login-otp/send-login-otp.handler';

export const AuthCommandHandlers = [
  RemoveSocialLoginHandler,
  SendLoginOTPHandler,
];
