import { OAuth2ProviderAddedHandler } from './oauth2-provider-added/oauth2-provider-added.handler';
import { OAuth2ProviderRemovedHandler } from './oauth2-provider-removed/oauth2-provider-removed.handler';
import { OAuth2ProviderUpdatedHandler } from './oauth2-provider-updated/oauth2-provider-updated.handler';

export const OAuth2ClientEventHandlers = [
  OAuth2ProviderAddedHandler,
  OAuth2ProviderRemovedHandler,
  OAuth2ProviderUpdatedHandler,
];
