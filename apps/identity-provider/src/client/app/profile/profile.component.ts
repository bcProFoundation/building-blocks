import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  PROFILE_TITLE,
  PERSONAL_DETAILS,
  PROFILE_DETAILS,
  ACCESS_DETAILS,
  UPDATE_CONSTANT,
  NO_AVATAR_SET,
  MALE_CONST,
  FEMALE_CONST,
  OTHER_CONST,
} from '../../constants/messages';
import { FormControl, FormGroup } from '@angular/forms';
import { TIME_ZONES } from '../../constants/timezones';
import { LOCALES } from '../../constants/locale';
import { OAuthService } from 'angular-oauth2-oidc';
import { IDTokenClaims } from '../../../server/models/id-token-claims.interfaces';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  genders: string[] = [MALE_CONST, FEMALE_CONST, OTHER_CONST];
  timezones = TIME_ZONES;
  locales = LOCALES;
  personalDetails = PERSONAL_DETAILS;
  profileDetails = PROFILE_DETAILS;
  accessDetails = ACCESS_DETAILS;
  updateConstant = UPDATE_CONSTANT;

  name: string;
  givenName: string;
  middleName: string;
  familyName: string;
  nickName: string;
  gender: string;
  birthdate: Date;
  picture: string;
  website: string;
  zoneinfo: string;
  locale: string;
  roles: string[] = [];
  groups: string[] = [];
  avatarUrl: string = NO_AVATAR_SET;

  personalForm = new FormGroup({
    name: new FormControl(this.name),
    givenName: new FormControl(this.givenName),
    middleName: new FormControl(this.middleName),
    familyName: new FormControl(this.familyName),
    nickname: new FormControl(this.nickName),
    gender: new FormControl(this.gender),
    birthdate: new FormControl({
      value: this.birthdate,
      disabled: true,
    }),
  });

  profileForm = new FormGroup({
    picture: new FormControl(this.picture),
    website: new FormControl(this.website),
    zoneinfo: new FormControl(this.zoneinfo),
    locale: new FormControl(this.locale),
  });

  constructor(private title: Title, private oauthService: OAuthService) {}

  ngOnInit() {
    this.title.setTitle(PROFILE_TITLE);
    const { roles } = this.oauthService.getIdentityClaims() as IDTokenClaims;
    this.roles = roles;
  }

  updatePersonal() {}
  updateProfile() {}
}
