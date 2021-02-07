import { UserAccountRemovedHandler } from './user-account-removed/user-account-removed.handler';
import { UserRoleRemovedHandler } from './user-role-removed/user-role-removed.handler';
import { ForgottenPasswordGeneratedHandler } from './forgotten-password-generated/forgotten-password-generated.handler';
import { PasswordChangedHandler } from './password-changed/password-changed.handler';
import { UserAccountAddedHandler } from './user-account-added/user-account-added.handler';
import { UserAccountModifiedHandler } from './user-account-modified/user-account-modified.handler';
import { EmailVerifiedAndPasswordSetHandler } from './email-verified-and-password-set/email-verified-and-password-set.handler';
import { AuthDataRemovedHandler } from './auth-data-removed/auth-data-removed.handler';
import { UserRoleAddedHandler } from './user-role-added/user-role-added.handler';
import { UserRoleModifiedHandler } from './user-role-modified/user-role-modified.handler';
import { UserClaimRemovedHandler } from './user-claim-removed/user-claim-removed.handler';
import { UserClaimAddedHandler } from './user-claim-added/user-claim-added.handler';
import { UserClaimUpdatedHandler } from './user-claim-updated/user-claim-updated.handler';
import { UserSignedUpViaEmailHandler } from './user-signed-up-via-email/user-signed-up-via-email.handler';
import { EmailVerificationCodeHandler } from '../commands/email-verification-code/email-verification-code.handler';

/* eslint-disable */
import { UnverifiedEmailVerificationCodeSentHandler } from './unverified-email-verification-code-sent/unverified-email-verification-code-sent.handler';
import { EmailVerifiedAndUpdatedHandler } from './email-verified-and-updated/email-verified-and-updated.handler';
export { UnverifiedEmailVerificationCodeSentEvent } from './unverified-email-verification-code-sent/unverified-email-verification-code-sent.event';
/* eslint-enable */

export const UserManagementEventHandlers = [
  UserAccountRemovedHandler,
  UserRoleRemovedHandler,
  ForgottenPasswordGeneratedHandler,
  PasswordChangedHandler,
  UserAccountAddedHandler,
  UserAccountModifiedHandler,
  EmailVerifiedAndPasswordSetHandler,
  AuthDataRemovedHandler,
  UserRoleAddedHandler,
  UserRoleModifiedHandler,
  UserClaimAddedHandler,
  UserClaimUpdatedHandler,
  UserClaimRemovedHandler,
  UserSignedUpViaEmailHandler,
  EmailVerificationCodeHandler,
  UnverifiedEmailVerificationCodeSentHandler,
  EmailVerifiedAndUpdatedHandler,
];
