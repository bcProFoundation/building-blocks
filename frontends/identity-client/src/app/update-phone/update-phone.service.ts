import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { ISSUER_URL } from '../constants/storage';
import { ADD_UNVERIFIED_PHONE, VERIFY_PHONE } from '../constants/url-paths';

@Injectable({
  providedIn: 'root',
})
export class UpdatePhoneService {
  constructor(
    private readonly http: HttpClient,
    private readonly oauth2: OAuthService,
  ) {}

  addUnverifiedPhone(unverifiedPhone: string) {
    const url = localStorage.getItem(ISSUER_URL) + ADD_UNVERIFIED_PHONE;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.oauth2.getAccessToken());

    return this.http.post(url, { unverifiedPhone }, { headers });
  }

  verifyPhone(otp: string) {
    const url = localStorage.getItem(ISSUER_URL) + VERIFY_PHONE;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.oauth2.getAccessToken());

    return this.http.post(url, { otp }, { headers });
  }
}
