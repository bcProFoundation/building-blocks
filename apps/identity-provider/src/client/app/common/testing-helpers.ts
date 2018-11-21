import { OAuthService, LoginOptions } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

export const oauthServiceStub: Partial<OAuthService> = {
  events: new Observable(),
  hasValidAccessToken: () => false,
  getIdentityClaims() {
    return { roles: [] };
  },
  configure(...args) {},
  setupAutomaticSilentRefresh(...args) {},
  loadDiscoveryDocumentAndTryLogin(options?: LoginOptions): Promise<boolean> {
    return Promise.resolve(true);
  },
  getAccessToken: () => 'mock_token',
};
