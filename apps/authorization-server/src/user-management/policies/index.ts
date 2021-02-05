import { PasswordPolicyService } from './password-policy/password-policy.service';
import { RoleValidationPolicyService } from './role-validation-policy/role-validation-policy.service';

export { CreateScopeDto } from './create-scope/create-scope.dto';
export { UserAccountDto } from './user-account/user-account.dto';
export { SignupViaEmailDto } from './signup-via-email/signup-via-email.dto';
export { VerifyEmailDto } from './verify-email/verify-email.dto';
export { ChangePasswordDto } from './change-password/change-password.dto';
export { SignupViaPhoneDto } from './signup-via-phone/signup-via-phone.dto';
export { VerifyPhoneDto } from './verify-phone/verify-phone.dto';
export { VerifySignupViaPhoneDto } from './verify-signup-via-phone/verify-signup-via-phone.dto';

export const UserManagementPolicies = [
  PasswordPolicyService,
  RoleValidationPolicyService,
];
