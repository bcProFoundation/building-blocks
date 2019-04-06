import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { ISSUER_URL, APP_URL } from '../../constants/storage';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  headers: HttpHeaders;

  constructor(private http: HttpClient, private oauthService: OAuthService) {
    this.headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.oauthService.getAccessToken(),
    });
  }

  getClientList() {
    const requestUrl =
      localStorage.getItem(ISSUER_URL) + '/client/v1/trusted_clients';
    return this.http.get(requestUrl, { headers: this.headers });
  }

  getService(uuid: string) {
    const requestUrl =
      localStorage.getItem(APP_URL) + '/service/v1/get_by_uuid/' + uuid;
    return this.http.get<any>(requestUrl, { headers: this.headers });
  }

  createService(
    name: string,
    type: string,
    clientId: string,
    serviceURL: string,
  ) {
    const url = `${localStorage.getItem(APP_URL)}/service/v1/register`;
    const serviceData = { name, type, clientId, serviceURL };
    return this.http.post<any>(url, serviceData, {
      headers: this.headers,
    });
  }

  modifyService(
    clientId: string,
    name: string,
    type: string,
    serviceURL: string,
  ) {
    const url = `${localStorage.getItem(
      APP_URL,
    )}/service/v1/modify/${clientId}`;
    const serviceData = { name, type, serviceURL };
    return this.http.post<any>(url, serviceData, {
      headers: this.headers,
    });
  }
}
