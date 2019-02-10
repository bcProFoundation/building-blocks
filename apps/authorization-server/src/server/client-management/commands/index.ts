import { RemoveOAuth2ClientHandler } from './remove-oauth2client/remove-oauth2client.handler';
import { RemoveOAuth2ScopeHandler } from './remove-oauth2scope/remove-oauth2scope.handler';

export const ClientManagementCommandHandlers = [
  RemoveOAuth2ClientHandler,
  RemoveOAuth2ScopeHandler,
];
