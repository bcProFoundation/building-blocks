import { RemoveUserAccountHandler } from './remove-user-account/remove-user-account.handler';
import { RemoveUserRoleHandler } from './remove-user-role/remove-user-role.handler';
import { GenerateForgottenPasswordHandler } from './generate-forgotten-password/generate-forgotten-password.handler';
import { ChangePasswordHandler } from './change-password/change-password.handler';
import { VerifyEmailAndSetPasswordHandler } from './verify-email-and-set-password/verify-email-and-set-password.handler';
import { AddUserAccountHandler } from './add-user-account/add-user-account.handler';
import { ModifyUserAccountHandler } from './modify-user-account/modify-user-account.handler';
import { TogglePasswordLessLoginHandler } from './toggle-password-less-login/toggle-password-less-login.handler';
import { Initialize2FAHandler } from './initialize-2fa/initialize-2fa.handler';
import { Verify2FAHandler } from './verify-2fa/verify-2fa.handler';
import { Disable2FAHandler } from './disable-2fa/disable-2fa.handler';
import { AddUserRoleHandler } from './add-user-role/add-user-role.handler';
import { ModifyUserRoleHandler } from './modify-user-role/modify-user-role.handler';
import { UpdateUserFullNameHandler } from './update-user-full-name/update-user-full-name.handler';

export const UserManagementCommandHandlers = [
  RemoveUserAccountHandler,
  RemoveUserRoleHandler,
  GenerateForgottenPasswordHandler,
  ChangePasswordHandler,
  VerifyEmailAndSetPasswordHandler,
  AddUserAccountHandler,
  ModifyUserAccountHandler,
  TogglePasswordLessLoginHandler,
  Initialize2FAHandler,
  Verify2FAHandler,
  Disable2FAHandler,
  AddUserRoleHandler,
  ModifyUserRoleHandler,
  UpdateUserFullNameHandler,
];
