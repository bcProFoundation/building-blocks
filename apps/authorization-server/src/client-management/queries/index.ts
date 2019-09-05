import { GetClientByUuidHandler } from './get-client-by-uuid/get-client-by-uuid.handler';
import { GetClientByClientIdHandler } from './get-client-by-client-id/get-client-by-client-id.handler';
import { GetTrustedClientsHandler } from './get-trusted-clients/get-trusted-clients.handler';
import { ListClientsHandler } from './list-clients/list-clients.handler';
import { ListScopesHandler } from './list-scopes/list-scopes.handler';
import { GetScopesHandler } from './get-scopes/get-scopes.handler';
import { GetScopeByUuidHandler } from './get-scope-by-uuid/get-scope-by-uuid.handler';

export const ClientManagementQueryHandlers = [
  GetClientByUuidHandler,
  GetClientByClientIdHandler,
  GetTrustedClientsHandler,
  ListClientsHandler,
  ListScopesHandler,
  GetScopesHandler,
  GetScopeByUuidHandler,
];
