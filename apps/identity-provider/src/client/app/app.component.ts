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
} from '../constants/storage';

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
    this.appService.getMessage().subscribe(response => {
      if (response.message) return; // { message: PLEASE_RUN_SETUP }
      this.appService.setInfoLocalStorage(response);
      const authConfig: AuthConfig = {
        clientId: localStorage.getItem(CLIENT_ID),
        redirectUri: localStorage.getItem(REDIRECT_URI),
        silentRefreshRedirectUri: localStorage.getItem(
          SILENT_REFRESH_REDIRECT_URI,
        ),
        loginUrl: localStorage.getItem(LOGIN_URL),
        scope: 'openid roles',
        issuer: localStorage.getItem(ISSUER_URL),
        disableAtHashCheck: true,
      };
      if (isDevMode()) authConfig.requireHttps = false;
      this.oauthService.configure(authConfig);
      this.oauthService.tokenValidationHandler = new JwksValidationHandler();
      this.oauthService.setupAutomaticSilentRefresh();
      this.oauthService.loadDiscoveryDocumentAndTryLogin();
    });
  }
}
