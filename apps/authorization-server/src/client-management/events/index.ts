import { OAuth2ClientRemovedHandler } from './oauth2client-removed/oauth2client-removed.handler';
import { OAuth2ScopeRemovedHandler } from './oauth2scope-removed/oauth2scope-removed.handler';
import { ClientAddedHandler } from './client-added/client-added.handler';
import { ClientModifiedHandler } from './client-modified/client-modified.handler';
import { ClientSecretUpdatedHandler } from './client-secret-updated/client-secret-updated.handler';
import { ClientSecretVerifiedHandler } from './client-secret-verified/client-secret-verified.handler';
import { OAuth2ScopeModifiedHandler } from './oauth2scope-modified/oauth2scope-modified.handler';
import { OAuth2ScopeAddedHandler } from './oauth2scope-added/oauth2scope-added.handler';

export const ClientManagementEventHandlers = [
  OAuth2ClientRemovedHandler,
  OAuth2ScopeRemovedHandler,
  ClientAddedHandler,
  ClientModifiedHandler,
  ClientSecretUpdatedHandler,
  ClientSecretVerifiedHandler,
  OAuth2ScopeAddedHandler,
  OAuth2ScopeModifiedHandler,
];
