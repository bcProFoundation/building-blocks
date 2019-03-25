import { SocialLoginManagementService } from './social-login-management/social-login-management.service';
import { OTPAggregateService } from './otp-aggregate/otp-aggregate.service';

export const AuthAggregates = [
  SocialLoginManagementService,
  OTPAggregateService,
];
