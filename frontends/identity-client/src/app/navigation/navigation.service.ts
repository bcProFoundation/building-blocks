import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import {
  CLIENT_ID,
  REDIRECT_URI,
  SILENT_REFRESH_REDIRECT_URI,
  LOGIN_URL,
  ISSUER_URL,
  USER_UUID,
} from '../constants/storage';
import { GET_PROFILE_DETAILS_URL } from '../constants/url-paths';

@Injectable()
export class NavigationService {
  authorizationHeader: HttpHeaders;
  constructor(
    private readonly http: HttpClient,
    private readonly oidc: OAuthService,
  ) {
    this.authorizationHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.oidc.getAccessToken(),
    });
  }

  clearInfoLocalStorage() {
    localStorage.removeItem(CLIENT_ID);
    localStorage.removeItem(REDIRECT_URI);
    localStorage.removeItem(SILENT_REFRESH_REDIRECT_URI);
    localStorage.removeItem(LOGIN_URL);
    localStorage.removeItem(ISSUER_URL);
    sessionStorage.removeItem(USER_UUID);
  }

  getAvatar(uuid: string) {
    return this.http.get<any>(GET_PROFILE_DETAILS_URL + '/' + uuid, {
      headers: this.authorizationHeader,
    });
  }
}
