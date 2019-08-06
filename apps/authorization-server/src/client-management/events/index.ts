import { OAuth2ClientRemovedHandler } from './oauth2client-removed/oauth2client-removed.handler';
import { OAuth2ScopeRemovedHandler } from './oauth2scope-removed/oauth2scope-removed.handler';
import { ClientAddedHandler } from './client-added/client-added.handler';
import { ClientModifiedHandler } from './client-modified/client-modified.handler';

export const ClientManagementEventHandlers = [
  OAuth2ClientRemovedHandler,
  OAuth2ScopeRemovedHandler,
  ClientAddedHandler,
  ClientModifiedHandler,
];
