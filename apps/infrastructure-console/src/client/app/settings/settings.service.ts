import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ISSUER_URL, APP_URL } from '../constants/storage';
import { OAuthService } from 'angular-oauth2-oidc';
import { OpenIDConfiguration } from '../interfaces/open-id-configuration.interface';

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
    const requestUrl = localStorage.getItem(ISSUER_URL) + '/settings/v1/get';
    return this.http.get(requestUrl, { headers: this.headers });
  }

  getClientSettings() {
    const requestUrl = localStorage.getItem(APP_URL) + '/settings/v1/get';
    return this.http.get(requestUrl, { headers: this.headers });
  }

  getClientList() {
    const requestUrl =
      localStorage.getItem(ISSUER_URL) + '/client/v1/trusted_clients';
    return this.http.get(requestUrl, { headers: this.headers });
  }

  update(issuerUrl, communicationServerClientId) {
    const requestUrl = localStorage.getItem(ISSUER_URL) + '/settings/v1/update';
    return this.http.post(
      requestUrl,
      {
        issuerUrl,
        communicationServerClientId,
      },
      { headers: this.headers },
    );
  }

  getClientUpdate(appURL, authServerURL, clientId, clientSecret) {
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
              next: success => {},
            });
        },
      });
  }
}
