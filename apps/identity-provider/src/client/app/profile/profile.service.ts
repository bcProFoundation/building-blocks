import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  UPDATE_PERSONAL_DETAILS_URL,
  UPDATE_PROFILE_DETAILS_URL,
  GET_PERSONAL_DETAILS_URL,
  GET_PROFILE_DETAILS_URL,
} from '../../constants/url-paths';

@Injectable()
export class ServerSettingsService {
  constructor(private http: HttpClient) {}

  updatePersonalDetails(personalDetails) {
    return this.http.post(UPDATE_PERSONAL_DETAILS_URL, personalDetails);
  }

  updateProfileDetails(profileDetails) {
    return this.http.post(UPDATE_PROFILE_DETAILS_URL, profileDetails);
  }

  getPersonalDetails() {
    return this.http.get(GET_PERSONAL_DETAILS_URL);
  }

  getProfileDetails() {
    return this.http.get(GET_PROFILE_DETAILS_URL);
  }
}
