import { RemoveUserAccountHandler } from './remove-user-account/remove-user-account.handler';
import { RemoveUserRoleHandler } from './remove-user-role/remove-user-role.handler';
import { GenerateForgottenPasswordHandler } from './generate-forgotten-password/generate-forgotten-password.handler';
import { ChangePasswordHandler } from './change-password/change-password.handler';
import { VerifyEmailAndSetPasswordHandler } from './verify-email-and-set-passsword/verify-email-and-set-password.handler';
import { AddUserAccountHandler } from './add-user-account/add-user-account.handler';
import { ModifyUserAccountHandler } from './modify-user-account/modify-user-account.handler';

export const UserManagementCommandHandlers = [
  RemoveUserAccountHandler,
  RemoveUserRoleHandler,
  GenerateForgottenPasswordHandler,
  ChangePasswordHandler,
  VerifyEmailAndSetPasswordHandler,
  AddUserAccountHandler,
  ModifyUserAccountHandler,
];
