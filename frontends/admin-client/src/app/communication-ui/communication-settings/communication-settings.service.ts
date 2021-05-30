import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { StorageService } from '../../common/services/storage/storage.service';
import { ISSUER_URL, COMMUNICATION_SERVER } from '../../constants/storage';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CommunicationSettingsService {
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
      this.storageService.getServiceURL(COMMUNICATION_SERVER) +
      '/settings/v1/get';
    return this.http.get(requestUrl, { headers: this.headers });
  }

  getClientList() {
    const requestUrl =
      localStorage.getItem(ISSUER_URL) + '/client/v1/trusted_clients';
    return this.http.get(requestUrl, { headers: this.headers });
  }

  getEmailAccounts() {
    const requestUrl =
      this.storageService.getServiceURL(COMMUNICATION_SERVER) +
      '/email/v1/list';
    return this.http
      .get<any>(requestUrl, { headers: this.headers })
      .pipe(map(data => data.docs));
  }

  getSavedSettings<T>() {
    const requestUrl =
      this.storageService.getServiceURL(COMMUNICATION_SERVER) +
      '/settings/v1/get';
    return this.http.get<T>(requestUrl, { headers: this.headers });
  }

  updateSettings(
    appURL: string,
    clientId: string,
    clientSecret: string,
    communicationServerSystemEmailAccount: string,
  ) {
    const communicationServer =
      this.storageService.getServiceURL(COMMUNICATION_SERVER);
    const authServerURL = localStorage.getItem(ISSUER_URL);
    return this.http.post(communicationServer + '/settings/v1/update', {
      appURL,
      authServerURL,
      clientId,
      clientSecret,
      communicationServerSystemEmailAccount,
    });
  }
}
