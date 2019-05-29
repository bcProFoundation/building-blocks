import { AddOAuth2ProviderHandler } from './add-oauth2-provider/add-oauth2-provider.handler';
import { RemoveOAuth2ProviderHandler } from './remove-oauth2-provider/remove-oauth2-provider.handler';
import { UpdateOAuth2ProviderHandler } from './update-oauth2-provider/update-oauth2-provider.handler';

export const OAuth2ClientCommandHandlers = [
  AddOAuth2ProviderHandler,
  RemoveOAuth2ProviderHandler,
  UpdateOAuth2ProviderHandler,
];
