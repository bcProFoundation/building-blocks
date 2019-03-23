import { UserAccountRemovedHandler } from './user-account-removed/user-account-removed.handler';
import { UserRoleRemovedHandler } from './user-role-removed/user-role-removed.handler';
import { ForgottenPasswordGeneratedHandler } from './forgotten-password-generated/forgotten-password-generated.handler';
import { PasswordChangedHandler } from './password-changed/password-changed.handler';
import { UserAccountAddedHandler } from './user-account-added/user-account-added.handler';
import { UserAccountModifiedHandler } from './user-account-modified/user-account-modified.handler';
import { EmailVerifiedAndPasswordSetHandler } from './email-verified-and-password-set/email-verified-and-password-set.handler';
import { AuthDataRemovedHandler } from './auth-data-removed/auth-data-removed.handler';

export const UserManagementEventHandlers = [
  UserAccountRemovedHandler,
  UserRoleRemovedHandler,
  ForgottenPasswordGeneratedHandler,
  PasswordChangedHandler,
  UserAccountAddedHandler,
  UserAccountModifiedHandler,
  EmailVerifiedAndPasswordSetHandler,
  AuthDataRemovedHandler,
];
