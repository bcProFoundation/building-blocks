import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { APP_URL, COMMUNICATION_SERVER_URL } from '../constants/storage';
import { OpenIDConfiguration } from '../interfaces/openid-configuration.interface';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  headers: HttpHeaders;
  constructor(private http: HttpClient, private oauthService: OAuthService) {
    this.headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.oauthService.getAccessToken(),
    });
  }

  getSettings() {
    const requestUrl = localStorage.getItem(APP_URL) + '/settings/v1/get';
    return this.http.get(requestUrl, { headers: this.headers });
  }

  getBucketOptions() {
    const requestUrl =
      localStorage.getItem(COMMUNICATION_SERVER_URL) + '/storage/v1/list';
    return this.http.get(requestUrl, { headers: this.headers });
  }

  update(appURL, authServerURL, clientId, clientSecret, storageUuid) {
    const requestUrl = localStorage.getItem(APP_URL) + '/settings/v1/update';
    this.http
      .get(authServerURL + '/.well-known/openid-configuration')
      .subscribe({
        next: (response: OpenIDConfiguration) => {
          return this.http
            .post(
              requestUrl,
              {
                appURL,
                authServerURL,
                clientId,
                clientSecret,
                cloudStorageSettings: storageUuid,
                authorizationURL: response.authorization_endpoint,
                callbackURLs: [
                  appURL + '/index.html',
                  appURL + '/silent-refresh.html',
                ],
                introspectionURL: response.introspection_endpoint,
                profileURL: response.userinfo_endpoint,
                revocationURL: response.revocation_endpoint,
                tokenURL: response.token_endpoint,
              },
              { headers: this.headers },
            )
            .subscribe({
              next: success => {
                return success;
              },
              error: err => {},
            });
        },
      });
  }
}
