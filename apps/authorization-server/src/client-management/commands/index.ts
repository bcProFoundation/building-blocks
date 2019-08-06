import { RemoveOAuth2ClientHandler } from './remove-oauth2client/remove-oauth2client.handler';
import { RemoveOAuth2ScopeHandler } from './remove-oauth2scope/remove-oauth2scope.handler';
import { AddClientHandler } from './add-client/add-client.handler';
import { ModifyClientHandler } from './modify-client/modify-client.handler';

export const ClientManagementCommandHandlers = [
  RemoveOAuth2ClientHandler,
  RemoveOAuth2ScopeHandler,
  AddClientHandler,
  ModifyClientHandler,
];
