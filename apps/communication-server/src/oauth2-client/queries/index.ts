import { ListOAuth2ProviderHandler } from './list-oauth2-providers/list-oauth2-providers.handler';
import { RetrieveOAuth2ProviderHandler } from './retrieve-oauth2-provider/retrieve-oauth2-provider.handler';

export const OAuth2ClientQueryHandlers = [
  ListOAuth2ProviderHandler,
  RetrieveOAuth2ProviderHandler,
];
