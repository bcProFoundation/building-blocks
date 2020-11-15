import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormControl, FormGroup } from '@angular/forms';
import { OAuthService } from 'angular-oauth2-oidc';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TIME_ZONES } from '../constants/timezones';
import { LOCALES } from '../constants/locale';
import { IDTokenClaims } from './id-token-claims.interfaces';
import { ProfileService } from './profile.service';
import { UserResponse } from '../interfaces/user-response.interface';
import { PersonalResponse } from '../interfaces/personal-response.interface';
import { USER_UUID, ISSUER_URL, APP_URL } from '../constants/storage';
import { LOGOUT_URL, MISSING_AVATAR_IMAGE } from '../constants/url-paths';
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
  PASSWORD_LESS_LOGIN_ENABLED,
  PASSWORD_LESS_LOGIN_DISABLED,
} from '../constants/messages';
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
  email: string;
  phone: string;
  enablePasswordLess: boolean;
  enableUserPhone: boolean;

  personalForm = new FormGroup({
    fullName: new FormControl(),
    email: new FormControl(),
    phone: new FormControl(),
    givenName: new FormControl(),
    middleName: new FormControl(),
    familyName: new FormControl(),
    nickname: new FormControl(),
    gender: new FormControl(),
    birthdate: new FormControl(),
  });

  profileForm = new FormGroup({
    picture: new FormControl(),
    website: new FormControl(),
    zoneinfo: new FormControl(),
    locale: new FormControl(),
  });

  changePasswordForm = new FormGroup({
    currentPassword: new FormControl(),
    newPassword: new FormControl(),
    repeatPassword: new FormControl(),
  });

  @Output() messageEvent = new EventEmitter<string>();

  @ViewChild('fileInput', { static: true }) fileInputRef: ElementRef;

  constructor(
    private title: Title,
    private oauthService: OAuthService,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit() {
    this.personalForm.controls.birthdate.disable();
    this.title.setTitle(PROFILE_TITLE);
    const { roles } = this.oauthService.getIdentityClaims() as IDTokenClaims;
    this.roles = roles;
    this.subscribeGetUser();
    this.checkServerForPhoneRegistration();
  }

  subscribeGetUser() {
    this.profileService
      .getAuthServerUser()
      .pipe(
        map(project => {
          sessionStorage.setItem(USER_UUID, (project as UserResponse).uuid);
          this.subscribeGetProfilePersonal();
          this.subscribeGetProfile();
          return project;
        }),
      )
      .subscribe({
        next: (response: UserResponse) => {
          this.personalForm.controls.fullName.setValue(response.name);
          this.personalForm.controls.email.setValue(response.email);
          this.personalForm.controls.phone.setValue(response.phone);
          this.checked2fa = response.enable2fa;
          this.uuid = response.uuid;
          this.isPasswordSet = response.isPasswordSet;
          this.enablePasswordLess = response.enablePasswordLess;
          this.phone = response.phone;
        },
        error: error => {},
      });
  }

  enablePasswordLessLogin() {
    this.profileService.enablePasswordLess().subscribe({
      next: success => {
        this.enablePasswordLess = true;
        this.snackBar.open(PASSWORD_LESS_LOGIN_ENABLED, CLOSE, {
          duration: DURATION,
        });
      },
      error: ({ error }) => {
        this.snackBar.open(error.message, CLOSE, {
          duration: DURATION,
        });
      },
    });
  }

  disablePasswordLess() {
    this.profileService.disablePasswordLess().subscribe({
      next: success => {
        this.enablePasswordLess = false;
        this.snackBar.open(PASSWORD_LESS_LOGIN_DISABLED, CLOSE, {
          duration: DURATION,
        });
      },
      error: error => {},
    });
  }

  subscribeGetProfilePersonal() {
    const uuid = sessionStorage.getItem(USER_UUID);
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
    const uuid = sessionStorage.getItem(USER_UUID);
    this.profileService.getProfileDetails(uuid).subscribe({
      next: (response: ProfileResponse) => {
        if (response) {
          if (response.picture) {
            this.picture = response.picture;
          } else {
            this.picture = MISSING_AVATAR_IMAGE;
          }
          this.messageEvent.emit(this.picture);
          this.profileForm.controls.website.setValue(response.website);
          this.profileForm.controls.zoneinfo.setValue(response.zoneinfo);
          this.profileForm.controls.locale.setValue(response.locale);
        }
      },
    });
  }

  onFileChanged() {
    this.selectedFile = this.fileInputRef.nativeElement.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      this.profileService.uploadAvatar(this.selectedFile).subscribe({
        next: (profile: any) => {
          reader.readAsDataURL(this.fileInputRef.nativeElement.files[0]);
          reader.onload = (file: any) => {
            this.picture = file.target.result;
            this.messageEvent.emit(this.picture);
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
      .subscribe({
        next: success => {},
        error: error => {},
      });
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

  updatePhone() {
    this.router.navigate(['update_phone']);
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
          if (Array.isArray(err.error.message)) {
            message = err.error.message[0];
          }
          this.snackBar.open(message, CLOSE, { duration: DURATION });
        },
      });
  }

  deleteAvatar() {
    this.profileService.deleteAvatar().subscribe({
      next: response => {
        this.picture = undefined;
        this.messageEvent.emit(this.picture);
        this.hideAvatar = false;
      },
      error: error => {},
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

  manageKeys() {
    let url = localStorage.getItem(ISSUER_URL) + '/account/keys/';
    url += this.uuid + '?access_token=' + this.oauthService.getAccessToken();
    window.location.href = url;
  }

  checkServerForPhoneRegistration() {
    this.profileService.checkServerForPhoneRegistration().subscribe({
      next: response => (this.enableUserPhone = response.enableUserPhone),
      error: error => (this.enableUserPhone = false),
    });
  }
}
