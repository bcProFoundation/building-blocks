import { UserAccountRemovedHandler } from './user-account-removed/user-account-removed.handler';
import { UserRoleRemovedHandler } from './user-role-removed/user-role-removed.handler';

export const UserManagementEventHandlers = [
  UserAccountRemovedHandler,
  UserRoleRemovedHandler,
];
