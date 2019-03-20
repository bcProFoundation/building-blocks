import { PasswordPolicyService } from './password-policy/password-policy.service';

export { CreateScopeDto } from './create-scope/create-scope.dto';
export { UserAccountDto } from './user-account/user-account.dto';
export { LoginUserDto } from './login-user/login-user.dto';
export { SignupViaEmailDto } from './signup-via-email/signup-via-email.dto';
export { VerifyEmailDto } from './verify-email/verify-email.dto';
export { ChangePasswordDto } from './change-password/change-password.dto';

export const UserManagementPolicies = [PasswordPolicyService];
