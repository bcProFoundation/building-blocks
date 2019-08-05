import { SocialLoginManagementService } from './social-login-management/social-login-management.service';
import { OTPAggregateService } from './otp-aggregate/otp-aggregate.service';
import { BearerTokenManagerService } from './bearer-token-manager/bearer-token-manager.service';

export const AuthAggregates = [
  SocialLoginManagementService,
  OTPAggregateService,
  BearerTokenManagerService,
];
