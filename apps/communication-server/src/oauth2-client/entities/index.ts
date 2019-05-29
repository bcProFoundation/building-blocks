import { OAuth2ProviderService } from './oauth2-provider/oauth2-provider.service';
import { OAuth2TokenService } from './oauth2-token/oauth2-token.service';

export const OAuth2ClientEntityProviders = [
  OAuth2ProviderService,
  OAuth2TokenService,
];
