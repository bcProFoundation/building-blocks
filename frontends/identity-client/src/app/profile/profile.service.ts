import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { MatSnackBar } from '@angular/material';
import { throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  UPDATE_PERSONAL_DETAILS_URL,
  UPDATE_PROFILE_DETAILS_URL,
  GET_PERSONAL_DETAILS_URL,
  GET_PROFILE_DETAILS_URL,
  GET_AUTH_SERVER_USER,
  SET_AUTH_SERVER_USER,
  CHANGE_PASSWORD_ENDPOINT,
  DELETE_AVATAR_ENDPOINT,
  DELETE_ME_ENDPOINT,
  FORGOT_PASSWORD,
  USER_INFO,
  INFO_ENDPOINT,
} from '../constants/url-paths';
import { ISSUER_URL, APP_URL } from '../constants/storage';
import { CLOSE, CURRENT_PASSWORD_MISMATCH } from '../constants/messages';
import { NavigationService } from '../navigation/navigation.service';
import { DURATION } from '../constants/app-constants';

@Injectable()
export class ProfileService {
  authorizationHeader: HttpHeaders;
  constructor(
    private http: HttpClient,
    private oauthService: OAuthService,
    private snackBar: MatSnackBar,
    private navigationService: NavigationService,
  ) {
    this.authorizationHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.oauthService.getAccessToken(),
    });
  }

  updatePersonalDetails(
    uuid: string,
    givenName: string,
    middleName: string,
    familyName: string,
    nickname: string,
    gender: string,
    birthdate: string,
  ) {
    return this.http.post(
      UPDATE_PERSONAL_DETAILS_URL,
      {
        uuid,
        givenName,
        middleName,
        familyName,
        nickname,
        gender,
        birthdate,
      },
      { headers: this.authorizationHeader },
    );
  }

  updateProfileDetails(
    uuid: string,
    website: string,
    zoneinfo: string,
    locale: string,
  ) {
    return this.http.post(
      UPDATE_PROFILE_DETAILS_URL,
      { uuid, website, zoneinfo, locale },
      { headers: this.authorizationHeader },
    );
  }

  disablePasswordLess() {
    const url =
      localStorage.getItem(ISSUER_URL) + '/user/v1/disable_password_less_login';
    return this.http.post(url, {}, { headers: this.authorizationHeader });
  }

  enablePasswordLess() {
    const url =
      localStorage.getItem(ISSUER_URL) + '/user/v1/enable_password_less_login';
    return this.http.post(url, {}, { headers: this.authorizationHeader });
  }

  getPersonalDetails(uuid) {
    return this.http.get(GET_PERSONAL_DETAILS_URL + '/' + uuid, {
      headers: this.authorizationHeader,
    });
  }

  getProfileDetails(uuid) {
    return this.http.get(GET_PROFILE_DETAILS_URL + '/' + uuid, {
      headers: this.authorizationHeader,
    });
  }

  getAuthServerUser() {
    return this.http.get(
      localStorage.getItem(ISSUER_URL) + GET_AUTH_SERVER_USER,
      {
        headers: this.authorizationHeader,
      },
    );
  }

  uploadAvatar(selectedFile) {
    const uploadData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);
    return this.http.post('/profile/v1/upload_avatar', uploadData, {
      reportProgress: true,
      headers: this.authorizationHeader,
    });
  }

  setAuthServerUser(user) {
    return this.http.post(
      localStorage.getItem(ISSUER_URL) + SET_AUTH_SERVER_USER,
      user,
      { headers: this.authorizationHeader },
    );
  }

  changePassword(
    currentPassword: string,
    newPassword: string,
    repeatPassword: string,
  ) {
    if (newPassword !== repeatPassword) {
      this.snackBar.open(CURRENT_PASSWORD_MISMATCH, CLOSE, {
        duration: DURATION,
      });
      return throwError({ message: CURRENT_PASSWORD_MISMATCH });
    } else {
      return this.http.post(
        localStorage.getItem(ISSUER_URL) + CHANGE_PASSWORD_ENDPOINT,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: this.authorizationHeader,
        },
      );
    }
  }

  logout() {
    this.navigationService.clearInfoLocalStorage();
  }

  deleteAvatar() {
    return this.http.post(
      localStorage.getItem(APP_URL) + DELETE_AVATAR_ENDPOINT,
      {
        headers: this.authorizationHeader,
      },
    );
  }

  deleteUser() {
    const issuerURL = localStorage.getItem(ISSUER_URL);
    return this.http.post(
      issuerURL + DELETE_ME_ENDPOINT,
      {},
      { headers: this.authorizationHeader },
    );
  }

  setPassword() {
    return this.http
      .get<{
        email?: string;
      }>(localStorage.getItem(ISSUER_URL) + USER_INFO, {
        headers: this.authorizationHeader,
      })
      .pipe(
        switchMap(userInfo => {
          return this.http.post(
            localStorage.getItem(ISSUER_URL) + FORGOT_PASSWORD,
            { emailOrPhone: userInfo.email },
          );
        }),
      );
  }

  checkServerForPhoneRegistration() {
    return this.http.get<any>(localStorage.getItem(ISSUER_URL) + INFO_ENDPOINT);
  }
}
