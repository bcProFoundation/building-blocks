import { RemoveUserAccountHandler } from './remove-user-account/remove-user-account.handler';
import { RemoveUserRoleHandler } from './remove-user-role/remove-user-role.handler';
import { GenerateForgottenPasswordHandler } from './generate-forgotten-password/generate-forgotten-password.handler';

export const UserManagementCommandHandlers = [
  RemoveUserAccountHandler,
  RemoveUserRoleHandler,
  GenerateForgottenPasswordHandler,
];
