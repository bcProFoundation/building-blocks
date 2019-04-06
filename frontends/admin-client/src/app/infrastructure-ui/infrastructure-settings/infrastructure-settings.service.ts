import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { StorageService } from '../../common/services/storage/storage.service';
import { INFRASTRUCTURE_CONSOLE, ISSUER_URL } from '../../constants/storage';

@Injectable({
  providedIn: 'root',
})
export class InfrastructureSettingsService {
  headers: HttpHeaders;
  constructor(
    private http: HttpClient,
    private oauthService: OAuthService,
    private storageService: StorageService,
  ) {
    this.headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.oauthService.getAccessToken(),
    });
  }

  getSettings() {
    const requestUrl =
      this.storageService.getServiceURL(INFRASTRUCTURE_CONSOLE) +
      '/settings/v1/get';
    return this.http.get(requestUrl, { headers: this.headers });
  }

  updateSettings(appURL: string, clientId: string, clientSecret: string) {
    const infrastructureConsole = this.storageService.getServiceURL(
      INFRASTRUCTURE_CONSOLE,
    );
    const authServerURL = localStorage.getItem(ISSUER_URL);
    return this.http.post(
      infrastructureConsole + '/settings/v1/update',
      {
        authServerURL,
        appURL,
        clientId,
        clientSecret,
      },
      { headers: this.headers },
    );
  }
}
