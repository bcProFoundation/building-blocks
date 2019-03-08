import { UserAccountRemovedHandler } from './user-account-removed/user-account-removed.handler';
import { UserRoleRemovedHandler } from './user-role-removed/user-role-removed.handler';
import { ForgottenPasswordGeneratedHandler } from './forgotten-password-generated/forgotten-password-generated.handler';
import { PasswordChangedHandler } from './password-changed/password-changed.handler';

export const UserManagementEventHandlers = [
  UserAccountRemovedHandler,
  UserRoleRemovedHandler,
  ForgottenPasswordGeneratedHandler,
  PasswordChangedHandler,
];
