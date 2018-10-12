import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class ProfileService {
  authorizationHeader: HttpHeaders;
  constructor(private oauthService: OAuthService) {
    this.authorizationHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.oauthService.getAccessToken(),
    });
  }

  updatePersonalDetails(personalDetails) {}

  updateProfileDetails(profileDetails) {}

  getPersonalDetails(uuid) {}

  getProfileDetails() {}

  getAuthServerUser() {}

  setAuthServerUser(user) {}
}
