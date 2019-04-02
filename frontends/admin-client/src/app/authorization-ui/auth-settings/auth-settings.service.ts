import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  ISSUER_URL,
  APP_URL,
  COMMUNICATION_SERVER,
} from '../../constants/storage';
import { OAuthService } from 'angular-oauth2-oidc';
import { OpenIDConfiguration } from '../../interfaces/open-id-configuration.interface';
import { switchMap, map } from 'rxjs/operators';
import { IAuthSettings } from './auth-settings.interface';
import { StorageService } from '../../common/services/storage/storage.service';
import { ListResponse } from '../../shared-ui/listing/listing-datasource';

@Injectable({
  providedIn: 'root',
})
export class AuthSettingsService {
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
    const requestUrl = localStorage.getItem(ISSUER_URL) + '/settings/v1/get';
    return this.http.get(requestUrl, { headers: this.headers });
  }

  getClientSettings<T>(appURL: string) {
    const requestUrl = appURL + '/settings/v1/get';
    return this.http.get<T>(requestUrl, { headers: this.headers });
  }

  updateClientSettings(appURL: string, payload: IAuthSettings) {
    const requestUrl = appURL + '/settings/v1/update';
    return this.http.post(requestUrl, payload, { headers: this.headers });
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

  getClientUpdate(
    appURL: string,
    authServerURL: string,
    clientId: string,
    clientSecret: string,
  ) {
    const requestUrl = localStorage.getItem(APP_URL) + '/settings/v1/update';
    return this.http
      .get<OpenIDConfiguration>(
        authServerURL + '/.well-known/openid-configuration',
      )
      .pipe(
        switchMap(response => {
          return this.http.post(
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
          );
        }),
      );
  }

  getEmailAccounts() {
    const requestUrl =
      this.storageService.getServiceURL(COMMUNICATION_SERVER) +
      '/email/v1/list';
    return this.http
      .get<ListResponse>(requestUrl, { headers: this.headers })
      .pipe(map(data => data.docs));
  }

  getSavedEmailAccount<T>() {
    const requestUrl =
      this.storageService.getServiceURL(COMMUNICATION_SERVER) +
      '/settings/v1/get';
    return this.http.get<T>(requestUrl, { headers: this.headers });
  }

  updateSystemEmailSettings(communicationServerSystemEmailAccount: string) {
    const communicationServer = this.storageService.getServiceURL(
      COMMUNICATION_SERVER,
    );
    return this.getClientSettings<IAuthSettings>(communicationServer).pipe(
      switchMap(settings => {
        return this.http.post(communicationServer + '/settings/v1/update', {
          appURL: settings.appURL,
          authServerURL: settings.authServerURL,
          clientId: settings.clientId,
          clientSecret: settings.clientSecret,
          communicationServerSystemEmailAccount,
        });
      }),
    );
  }

  getBucketOptions() {
    const requestUrl =
      this.storageService.getServiceURL(COMMUNICATION_SERVER) +
      '/storage/v1/list';
    return this.http
      .get<ListResponse>(requestUrl, { headers: this.headers })
      .pipe(map(data => data.docs));
  }
}
