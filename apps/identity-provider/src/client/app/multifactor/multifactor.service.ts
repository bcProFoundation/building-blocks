import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { ISSUER_URL } from '../constants/storage';
import {
  INITIALIZE_2FA,
  VERIFY_2FA,
  DISABLE_2FA,
} from '../constants/url-paths';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MultifactorService {
  authorizationHeader: HttpHeaders;
  constructor(private http: HttpClient, private oauthService: OAuthService) {
    this.authorizationHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.oauthService.getAccessToken(),
    });
  }

  enable2fa() {
    return this.http.post(
      localStorage.getItem(ISSUER_URL) + INITIALIZE_2FA + '?restart=true',
      null,
      { headers: this.authorizationHeader },
    );
  }

  verify2fa(otp: string) {
    return this.http.post(
      localStorage.getItem(ISSUER_URL) + VERIFY_2FA,
      { otp },
      { headers: this.authorizationHeader },
    );
  }

  disable2fa() {
    return this.http.post(
      localStorage.getItem(ISSUER_URL) + DISABLE_2FA,
      null,
      { headers: this.authorizationHeader },
    );
  }
}
