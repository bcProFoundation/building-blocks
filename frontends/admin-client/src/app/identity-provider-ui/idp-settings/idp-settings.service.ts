import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { StorageService } from '../../common/services/storage/storage.service';
import {
  IDENTITY_PROVIDER,
  ISSUER_URL,
  COMMUNICATION_SERVER,
  APP_URL,
} from '../../constants/storage';
import { map } from 'rxjs/operators';
import { LOGOUT_URL } from '../../constants/url-paths';

@Injectable({
  providedIn: 'root',
})
export class IdpSettingsService {
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
      this.storageService.getServiceURL(IDENTITY_PROVIDER) + '/settings/v1/get';
    return this.http.get(requestUrl, { headers: this.headers });
  }

  getCloudStorages() {
    const requestUrl =
      this.storageService.getServiceURL(COMMUNICATION_SERVER) +
      '/storage/v1/list';
    return this.http
      .get<any>(requestUrl, { headers: this.headers })
      .pipe(map(data => data.docs));
  }

  updateSettings(
    appURL: string,
    clientId: string,
    clientSecret: string,
    cloudStorageSettings: string,
  ) {
    const identityProvider =
      this.storageService.getServiceURL(IDENTITY_PROVIDER);
    const authServerURL = localStorage.getItem(ISSUER_URL);
    return this.http.post(identityProvider + '/settings/v1/update', {
      appURL,
      authServerURL,
      clientId,
      clientSecret,
      cloudStorageSettings,
    });
  }

  deleteCachedTokens() {
    const identityProvider =
      this.storageService.getServiceURL(IDENTITY_PROVIDER);
    return this.http.post(
      identityProvider + '/settings/v1/clear_token_cache',
      {},
    );
  }

  logout() {
    const logoutUrl =
      localStorage.getItem(ISSUER_URL) +
      LOGOUT_URL +
      '?redirect=' +
      localStorage.getItem(APP_URL);
    this.storageService.clearInfoLocalStorage();
    this.oauthService.logOut();
    window.location.href = logoutUrl;
  }
}
