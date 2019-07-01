import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormControl, FormGroup } from '@angular/forms';
import { TIME_ZONES } from '../constants/timezones';
import { LOCALES } from '../constants/locale';
import { OAuthService } from 'angular-oauth2-oidc';
import { IDTokenClaims } from './id-token-claims.interfaces';
import { ProfileService } from './profile.service';
import { UserResponse } from '../interfaces/user-response.interface';
import { MatDatepickerInputEvent, MatSnackBar } from '@angular/material';
import { USER_UUID, ISSUER_URL, APP_URL } from '../constants/storage';
import { map } from 'rxjs/operators';
import { PersonalResponse } from '../interfaces/personal-response.interface';
import { LOGOUT_URL, MISSING_AVATAR_IMAGE } from '../constants/url-paths';
import { Router } from '@angular/router';
import { ProfileResponse } from '../interfaces/profile-response.interface';
import {
  MALE_CONST,
  FEMALE_CONST,
  OTHER_CONST,
  NO_AVATAR_SET,
  PROFILE_TITLE,
  UPDATE_SUCCESSFUL,
  CLOSE,
  DELETING,
  UNDO,
  AVATAR_UPDATED,
  AVATAR_UPDATED_FAILED,
  UPDATE_FAILED,
} from '../constants/messages';
import { isArray } from 'util';
import {
  DURATION,
  UNDO_DURATION,
  ADMINISTRATOR,
} from '../constants/app-constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  genders: string[] = [MALE_CONST, FEMALE_CONST, OTHER_CONST];
  timezones = TIME_ZONES;
  locales = LOCALES;
  missingAvatarImage = MISSING_AVATAR_IMAGE;

  uuid: string;
  selectedFile: File;
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
  hideAvatar: boolean = false;
  flagDeleteUser: boolean = false;
  isPasswordSet: boolean;
  sentForgotPasswordEmail: boolean = false;

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
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit() {
    this.title.setTitle(PROFILE_TITLE);
    const { roles } = this.oauthService.getIdentityClaims() as IDTokenClaims;
    this.roles = roles;
    this.subscribeGetUser();
  }

  subscribeGetUser() {
    this.profileService
      .getAuthServerUser()
      .pipe(
        map(project => {
          localStorage.setItem(USER_UUID, (project as UserResponse).uuid);
          this.subscribeGetProfilePersonal();
          this.subscribeGetProfile();
          return project;
        }),
      )
      .subscribe({
        next: (response: UserResponse) => {
          this.personalForm.controls.fullName.setValue(response.name);
          this.checked2fa = response.enable2fa;
          this.uuid = response.uuid;
          this.isPasswordSet = response.isPasswordSet;
        },
      });
  }

  subscribeGetProfilePersonal() {
    const uuid = localStorage.getItem(USER_UUID);
    this.profileService.getPersonalDetails(uuid).subscribe({
      next: (response: PersonalResponse) => {
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

  subscribeGetProfile() {
    const uuid = localStorage.getItem(USER_UUID);
    this.profileService.getProfileDetails(uuid).subscribe({
      next: (response: ProfileResponse) => {
        if (response) {
          if (response.picture) {
            this.picture = response.picture;
          } else {
            this.picture = MISSING_AVATAR_IMAGE;
          }
          this.profileForm.controls.website.setValue(response.website);
          this.profileForm.controls.zoneinfo.setValue(response.zoneinfo);
          this.profileForm.controls.locale.setValue(response.locale);
        }
      },
    });
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    this.profileService.uploadAvatar(this.selectedFile).subscribe({
      next: (profile: any) => {
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (file: any) => {
          this.picture = file.target.result;
        };
        this.hideAvatar = false;
        this.snackBar.open(AVATAR_UPDATED, CLOSE, { duration: DURATION });
      },
      error: err => {
        this.snackBar.open(AVATAR_UPDATED_FAILED, CLOSE, {
          duration: DURATION,
        });
      },
    });
  }

  updatePersonal() {
    this.profileService
      .updatePersonalDetails(
        this.uuid,
        this.personalForm.controls.givenName.value,
        this.personalForm.controls.middleName.value,
        this.personalForm.controls.familyName.value,
        this.personalForm.controls.nickname.value,
        this.personalForm.controls.gender.value,
        this.personalForm.controls.birthdate.value,
      )
      .subscribe({
        next: response => {
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, {
            duration: DURATION,
          });
        },
        error: error => {
          this.snackBar.open(UPDATE_FAILED, CLOSE, {
            duration: DURATION,
          });
        },
      });
    this.profileService
      .setAuthServerUser({ name: this.personalForm.controls.fullName.value })
      .subscribe();
  }

  toggleFileField() {
    this.hideAvatar = !this.hideAvatar;
  }

  updateProfile() {
    let website: string;
    if (this.profileForm.controls.website.value) {
      website = this.profileForm.controls.website.value;
    }
    this.profileService
      .updateProfileDetails(
        this.uuid,
        website,
        this.profileForm.controls.zoneinfo.value,
        this.profileForm.controls.locale.value,
      )
      .subscribe({
        next: response => {
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, {
            duration: DURATION,
          });
        },
        error: error => {
          this.snackBar.open(UPDATE_FAILED, CLOSE, {
            duration: DURATION,
          });
        },
      });
  }

  enableDisable2fa() {
    this.router.navigate(['mfa']);
  }

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
        next: data => this.logout(),
        error: err => {
          let message = err.error.message;
          if (isArray(err.error.message)) {
            message = err.error.message[0];
          }
          this.snackBar.open(message, CLOSE, { duration: DURATION });
        },
      });
  }

  deleteAvatar() {
    this.profileService.deleteAvatar().subscribe(response => {
      this.picture = undefined;
    });
  }

  deleteUser() {
    this.flagDeleteUser = true;
    const snackBar = this.snackBar.open(DELETING, UNDO, {
      duration: UNDO_DURATION,
    });

    snackBar.afterDismissed().subscribe({
      next: dismissed => {
        if (this.flagDeleteUser) {
          this.profileService.deleteUser().subscribe({
            next: deleted => {
              this.oauthService.logOut();
              this.logout();
            },
            error: error => {},
          });
        }
      },
      error: error => {},
    });

    snackBar.onAction().subscribe({
      next: success => {
        this.flagDeleteUser = false;
      },
      error: error => {},
    });
  }

  logout() {
    const logoutUrl =
      localStorage.getItem(ISSUER_URL) +
      LOGOUT_URL +
      '?redirect=' +
      localStorage.getItem(APP_URL);
    this.profileService.logout();
    this.oauthService.logOut();
    window.location.href = logoutUrl;
  }

  setPassword() {
    this.profileService.setPassword().subscribe({
      next: response => {
        this.sentForgotPasswordEmail = true;
      },
      error: err => {},
    });
  }

  checkIfAdmin() {
    return this.roles.includes(ADMINISTRATOR);
  }
}
