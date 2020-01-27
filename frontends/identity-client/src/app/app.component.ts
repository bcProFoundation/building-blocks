import { Component } from '@angular/core';
import { AppService } from './app.service';
import { isDevMode } from '@angular/core';
import {
  OAuthService,
  JwksValidationHandler,
  AuthConfig,
} from 'angular-oauth2-oidc';
import {
  CLIENT_ID,
  REDIRECT_URI,
  SILENT_REFRESH_REDIRECT_URI,
  LOGIN_URL,
  ISSUER_URL,
  ENABLE_CHOOSING_ACCOUNT,
  CLEAR_SESSION,
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
          silentRefreshRedirectUri: localStorage.getItem(
            SILENT_REFRESH_REDIRECT_URI,
          ),
          loginUrl: localStorage.getItem(LOGIN_URL),
          scope: 'openid roles email profile',
          issuer: localStorage.getItem(ISSUER_URL),
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
        this.oauthService.setupAutomaticSilentRefresh();
        this.oauthService.loadDiscoveryDocumentAndLogin();
      },
      error: error => {},
    });
  }
}
