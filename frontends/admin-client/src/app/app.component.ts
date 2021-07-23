import { Component, isDevMode, OnInit } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { AppService } from './app.service';
import { StorageService } from './common/services/storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private appService: AppService,
    private oauthService: OAuthService,
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
    this.appService.getMessage().subscribe({
      next: response => {
        if (response.message) return; // { message: PLEASE_RUN_SETUP }
        this.storageService.setInfoLocalStorage(response);
        const authConfig: AuthConfig = {
          clientId: response.clientId,
          redirectUri: response.callbackURLs[0],
          loginUrl: response.authorizationURL,
          scope: 'openid roles',
          issuer: response.authServerURL,
          responseType: 'code',
          useSilentRefresh: true,
        };

        if (isDevMode()) authConfig.requireHttps = false;
        this.oauthService.configure(authConfig);
        this.oauthService.tokenValidationHandler = new JwksValidationHandler();
        this.oauthService.loadDiscoveryDocumentAndLogin();
      },
      error: error => {},
    });
  }
}
