import { Component, isDevMode } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { AppService } from './app.service';
import {
  CLEAR_SESSION,
  CLIENT_ID,
  ENABLE_CHOOSING_ACCOUNT,
  ISSUER_URL,
  LOGIN_URL,
  REDIRECT_URI,
} from './constants/storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private appService: AppService,
    private oauthService: OAuthService,
  ) {
    this.setupOIDC();
  }

  setupOIDC(): void {
    this.appService.getMessage().subscribe({
      next: response => {
        if (response.message) return; // { message: PLEASE_RUN_SETUP }
        this.appService.setInfoLocalStorage(response);
        const authConfig: AuthConfig = {
          clientId: localStorage.getItem(CLIENT_ID),
          redirectUri: localStorage.getItem(REDIRECT_URI),
          loginUrl: localStorage.getItem(LOGIN_URL),
          scope: 'openid roles email profile phone',
          issuer: localStorage.getItem(ISSUER_URL),
          responseType: 'code',
          useSilentRefresh: true,
        };

        const enableChoosingAccount =
          localStorage.getItem(ENABLE_CHOOSING_ACCOUNT) === 'true';

        const clearSession = localStorage.getItem(CLEAR_SESSION) === 'true';

        if (clearSession) {
          sessionStorage.clear();
          localStorage.removeItem(CLEAR_SESSION);
        }

        if (enableChoosingAccount) {
          authConfig.customQueryParams = { prompt: 'select_account' };
        }

        if (isDevMode()) authConfig.requireHttps = false;
        this.oauthService.configure(authConfig);
        this.oauthService.tokenValidationHandler = new JwksValidationHandler();
        this.oauthService.loadDiscoveryDocumentAndLogin();
      },
      error: error => {},
    });
  }
}
