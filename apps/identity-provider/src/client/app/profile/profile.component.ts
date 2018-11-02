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
  SECURITY_DETAILS,
  UPDATE_SUCCESSFUL,
  CLOSE,
  CHANGE_PASSWORD,
} from '../../constants/messages';
import { FormControl, FormGroup } from '@angular/forms';
import { TIME_ZONES } from '../../constants/timezones';
import { LOCALES } from '../../constants/locale';
import { OAuthService } from 'angular-oauth2-oidc';
import { IDTokenClaims } from '../../../server/models/id-token-claims.interfaces';
import { ProfileService } from './profile.service';
import { UserResponse } from '../interfaces/user-response.interface';
import { MatDatepickerInputEvent, MatSnackBar } from '@angular/material';
import { USER_UUID, ISSUER_URL, APP_URL } from '../../constants/storage';
import { map } from 'rxjs/operators';
import { ProfileResponse } from '../interfaces/profile-response.interface';
import { LOGOUT_URL } from '../../constants/url-paths';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  genders: string[] = [MALE_CONST, FEMALE_CONST, OTHER_CONST];
  timezones = TIME_ZONES;
  locales = LOCALES;
  updateConstant = UPDATE_CONSTANT;
  personalDetails = PERSONAL_DETAILS;
  profileDetails = PROFILE_DETAILS;
  accessDetails = ACCESS_DETAILS;
  securityDetails = SECURITY_DETAILS;
  changePassword = CHANGE_PASSWORD;

  uuid: string;
  fullName: string;
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
  checked2fa: boolean = true;
  showPasswordSection: boolean = false;
  currentPassword: string;
  newPassword: string;
  repeatPassword: string;

  personalForm = new FormGroup({
    fullName: new FormControl(this.fullName),
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

  changePasswordForm = new FormGroup({
    currentPassword: new FormControl(this.currentPassword),
    newPassword: new FormControl(this.newPassword),
    repeatPassword: new FormControl(this.repeatPassword),
  });

  constructor(
    private title: Title,
    private oauthService: OAuthService,
    private profileService: ProfileService,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.title.setTitle(PROFILE_TITLE);
    const { roles } = this.oauthService.getIdentityClaims() as IDTokenClaims;
    this.roles = roles;
    this.subscribeGetUser();
    this.subscribeGetProfilePersonal();
  }

  subscribeGetUser() {
    this.profileService
      .getAuthServerUser()
      .pipe(
        map(project => {
          localStorage.setItem(USER_UUID, (project as UserResponse).uuid);
          return project;
        }),
      )
      .subscribe({
        next: (response: UserResponse) => {
          this.personalForm.controls.fullName.setValue(response.name);
          this.checked2fa = response.enable2fa;
          this.uuid = response.uuid;
        },
      });
  }

  subscribeGetProfilePersonal() {
    const uuid = localStorage.getItem(USER_UUID);
    this.profileService.getPersonalDetails(uuid).subscribe({
      next: (response: ProfileResponse) => {
        if (response) {
          this.personalForm.controls.familyName.setValue(response.familyName);
          this.personalForm.controls.birthdate.setValue(response.birthdate);
          this.personalForm.controls.gender.setValue(response.gender);
          this.personalForm.controls.givenName.setValue(response.givenName);
          this.personalForm.controls.middleName.setValue(response.middleName);
          this.personalForm.controls.familyName.setValue(response.familyName);
          this.personalForm.controls.nickname.setValue(response.nickname);
        }
      },
    });
  }

  updatePersonal() {
    this.profileService
      .updatePersonalDetails({
        uuid: this.uuid,
        givenName: this.personalForm.controls.givenName.value,
        middleName: this.personalForm.controls.middleName.value,
        familyName: this.personalForm.controls.familyName.value,
        nickname: this.personalForm.controls.nickname.value,
        gender: this.personalForm.controls.gender.value,
        birthdate: this.personalForm.controls.birthdate.value,
      })
      .subscribe({
        next: response =>
          this.snackbar.open(UPDATE_SUCCESSFUL, CLOSE, {
            duration: 2000,
          }),
      });
    this.profileService
      .setAuthServerUser({ name: this.personalForm.controls.fullName.value })
      .subscribe();
  }
  updateProfile() {}
  enableDisable2fa() {}
  updateBirthdate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.birthdate = event.value;
  }

  showChangePassword() {
    this.showPasswordSection = true;
  }

  changePasswordRequest() {
    this.profileService
      .changePassword(
        this.changePasswordForm.controls.currentPassword.value,
        this.changePasswordForm.controls.newPassword.value,
        this.changePasswordForm.controls.repeatPassword.value,
      )
      .subscribe({
        next: data => {
          const logoutUrl =
            localStorage.getItem(ISSUER_URL) +
            LOGOUT_URL +
            '?redirect=' +
            localStorage.getItem(APP_URL);
          this.profileService.logout();
          this.oauthService.logOut();
          window.location.href = logoutUrl;
        },
        error: err => {
          this.snackbar.open(err.error.message, CLOSE, { duration: 2000 });
        },
      });
  }
}
