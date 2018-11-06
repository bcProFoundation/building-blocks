import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

export const oauthServiceStub: Partial<OAuthService> = {
  events: new Observable(),
  hasValidAccessToken: () => false,
  getIdentityClaims() {
    return { roles: [] };
  },
  configure(...args) {},
  setupAutomaticSilentRefresh(...args) {},
  loadDiscoveryDocumentAndTryLogin(optins?: any): Promise<void> {
    return Promise.resolve();
  },
};
