import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ISSUER_URL } from '../constants/storage';
import { OAuthService } from 'angular-oauth2-oidc';

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
}
