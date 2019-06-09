import { Client, CLIENT } from './client/client.schema';
import { SCOPE, Scope } from './scope/scope.schema';

export const ClientManagementModuleEntities = [
  { name: CLIENT, schema: Client },
  { name: SCOPE, schema: Scope },
];
