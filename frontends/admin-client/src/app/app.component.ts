import { Component, isDevMode } from '@angular/core';
import { AppService } from './app.service';
import {
  OAuthService,
  JwksValidationHandler,
  AuthConfig,
} from 'angular-oauth2-oidc';
import { StorageService } from './common/services/storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private appService: AppService,
    private oauthService: OAuthService,
    private storageService: StorageService,
  ) {
    this.setupOIDC();
  }

  setupOIDC(): void {
    this.appService.getMessage().subscribe({
      next: response => {
        if (response.message) return; // { message: PLEASE_RUN_SETUP }
        this.storageService.setInfoLocalStorage(response);
        const authConfig: AuthConfig = {
          clientId: response.clientId,
          redirectUri: response.callbackURLs[0],
          silentRefreshRedirectUri: response.callbackURLs[1],
          loginUrl: response.authorizationURL,
          scope: 'openid roles',
          issuer: response.authServerURL,
        };
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
