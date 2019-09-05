import { RemoveOAuth2ClientHandler } from './remove-oauth2client/remove-oauth2client.handler';
import { RemoveOAuth2ScopeHandler } from './remove-oauth2scope/remove-oauth2scope.handler';
import { AddClientHandler } from './add-client/add-client.handler';
import { ModifyClientHandler } from './modify-client/modify-client.handler';
import { UpdateClientSecretHandler } from './update-client-secret/update-client-secret.handler';
import { VerifyChangedClientSecretHandler } from './verify-changed-client-secret/verify-changed-client-secret.handler';
import { AddOAuth2ScopeHandler } from './add-oauth2scope/add-oauth2scope.handler';
import { ModifyOAuth2ScopeHandler } from './modify-oauth2scope/modify-oauth2scope.handler';

export const ClientManagementCommandHandlers = [
  RemoveOAuth2ClientHandler,
  RemoveOAuth2ScopeHandler,
  AddClientHandler,
  ModifyClientHandler,
  UpdateClientSecretHandler,
  VerifyChangedClientSecretHandler,
  AddOAuth2ScopeHandler,
  ModifyOAuth2ScopeHandler,
];
