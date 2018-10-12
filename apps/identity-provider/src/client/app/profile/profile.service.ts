import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  UPDATE_PERSONAL_DETAILS_URL,
  UPDATE_PROFILE_DETAILS_URL,
  GET_PERSONAL_DETAILS_URL,
  GET_PROFILE_DETAILS_URL,
  GET_AUTH_SERVER_USER,
  SET_AUTH_SERVER_USER,
} from '../../constants/url-paths';
import { ISSUER_URL } from '../../constants/storage';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class ProfileService {
  authorizationHeader: HttpHeaders;
  constructor(private http: HttpClient, private oauthService: OAuthService) {
    this.authorizationHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.oauthService.getAccessToken(),
    });
  }

  updatePersonalDetails(personalDetails) {
    return this.http.post(UPDATE_PERSONAL_DETAILS_URL, personalDetails, {
      headers: this.authorizationHeader,
    });
  }

  updateProfileDetails(profileDetails) {
    return this.http.post(UPDATE_PROFILE_DETAILS_URL, profileDetails);
  }

  getPersonalDetails(uuid) {
    return this.http.get(GET_PERSONAL_DETAILS_URL + '/' + uuid, {
      headers: this.authorizationHeader,
    });
  }

  getProfileDetails() {
    return this.http.get(GET_PROFILE_DETAILS_URL);
  }

  getAuthServerUser() {
    return this.http.get(
      localStorage.getItem(ISSUER_URL) + GET_AUTH_SERVER_USER,
      {
        headers: this.authorizationHeader,
      },
    );
  }

  setAuthServerUser(user) {
    return this.http.post(
      localStorage.getItem(ISSUER_URL) + SET_AUTH_SERVER_USER,
      user,
      { headers: this.authorizationHeader },
    );
  }
}
