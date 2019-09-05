import { ListSessionUsersHandler } from './list-session-users/list-session-users.handler';
import { ListRolesHandler } from './list-roles/list-roles.handler';
import { GetRolesHandler } from './get-roles/get-roles.handler';
import { RetrieveRolesHandler } from './retrieve-role/retrieve-role.handler';

export const UserManagementQueryHandlers = [
  ListSessionUsersHandler,
  ListRolesHandler,
  GetRolesHandler,
  RetrieveRolesHandler,
];
