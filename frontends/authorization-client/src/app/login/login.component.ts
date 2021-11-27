import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  PLEASE_CHECK_EMAIL,
  CLOSE,
  PLEASE_CHECK_USERNAME,
  DURATION,
  NO_KEYS_REGISTERED,
} from '../constants/app-strings';
import { LoginChoice } from './login-choice';
import { BrandInfoService } from '../common/brand-info/brand-info.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // Declared Public to allow Ahead of Time compilation for production
  public username: string = '';
  public password: string = '';
  public code: string = '';

  hideUsername: boolean = false;
  hidePassword: boolean = true;
  hideCode: boolean = true;
  enable2fa: boolean = false;
  serverError: string;
  socialLogins: { name: string; uuid: string }[];
  redirect: string;
  showSocialLogins: boolean = false;
  enablePasswordLess: boolean = false;
  loginChoice: LoginChoice = LoginChoice.Standard;
  disableLoginChoice: boolean = false;
  disableResendOTP: boolean = false;
  logoURL: string;
  disableVerifyUserButton: boolean = false;
  disableVerifyPasswordButton: boolean = false;
  disableOnSubmitOTPButton: boolean = false;
  isPassHidden: boolean = true;

  @ViewChild('password', { static: true }) passwordRef: ElementRef;
  @ViewChild('otp', { static: true }) otpRef: ElementRef;
  @ViewChild('username', { static: true }) usernameRef: ElementRef;
  @ViewChild('reSendOTP', { static: true }) reSendOTPRef: ElementRef;

  verifyUserForm = new FormGroup({
    username: new FormControl(this.username),
  });

  loginUserForm = new FormGroup({
    username: new FormControl(this.username),
    password: new FormControl(this.password),
  });

  submitOTPForm = new FormGroup({
    code: new FormControl(this.code),
  });

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(
    private authService: AuthService,
    private brandInfoService: BrandInfoService,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.usernameRef.nativeElement.focus();
    this.redirect = this.route.snapshot.queryParamMap.get('redirect');
    this.getSocialLogins();
    this.getBrandInfo();
  }

  onSubmitOTP() {
    this.disableOnSubmitOTPButton = true;
    this.submitOTPForm.controls.code.disable();

    if (this.loginChoice === LoginChoice.PasswordLess) {
      this.sendPasswordLessOTP();
    } else {
      this.sendStandardOTP();
    }
  }

  sendStandardOTP() {
    this.authService
      .logIn(
        this.verifyUserForm.controls.username.value,
        this.loginUserForm.controls.password.value,
        this.submitOTPForm.controls.code.value,
      )
      .subscribe({
        next: (response: any) => {
          this.submitOTPForm.controls.code.setErrors(null);
          const loginType = this.route.snapshot.queryParams.login_type;
          if (!loginType) {
            window.location.href = response.path;
          } else if (loginType === 'add_account') {
            this.chooseAccount();
          }
        },
        error: err => {
          this.disableOnSubmitOTPButton = false;
          this.submitOTPForm.controls.code.enable();

          this.serverError = err.error.message;
          this.submitOTPForm.controls.code.setErrors({ incorrect: true });
        },
      });
  }

  sendPasswordLessOTP() {
    this.authService
      .passwordLessLogin(
        this.verifyUserForm.controls.username.value,
        this.submitOTPForm.controls.code.value,
      )
      .subscribe({
        next: (response: any) => {
          this.submitOTPForm.controls.code.setErrors(null);
          const loginType = this.route.snapshot.queryParams.login_type;
          if (!loginType) {
            window.location.href = response.path;
          } else if (loginType === 'add_account') {
            this.chooseAccount();
          }
        },
        error: err => {
          this.disableOnSubmitOTPButton = false;
          this.submitOTPForm.controls.code.enable();

          this.serverError = err.error.message;
          this.submitOTPForm.controls.code.setErrors({ incorrect: true });
        },
      });
  }

  onSubmitPassword() {
    this.disableVerifyPasswordButton = true;
    this.loginUserForm.controls.password.disable();

    if (this.enable2fa) {
      this.authService
        .verifyPassword(
          this.verifyUserForm.controls.username.value,
          this.loginUserForm.controls.password.value,
        )
        .subscribe({
          next: (response: any) => {
            this.loginUserForm.controls.password.setErrors(null);
            this.hideCode = false;
            this.hidePassword = true;

            this.disableVerifyPasswordButton = false;
            this.loginUserForm.controls.password.enable();

            setTimeout(() => this.otpRef.nativeElement.focus());
          },
          error: err => {
            this.disableVerifyPasswordButton = false;
            this.loginUserForm.controls.password.enable();

            this.serverError = err.error.message;
            this.loginUserForm.controls.password.setErrors({
              incorrect: true,
            });
          },
        });
    } else {
      this.authService
        .logIn(
          this.verifyUserForm.controls.username.value,
          this.loginUserForm.controls.password.value,
        )
        .subscribe({
          next: (response: any) => {
            this.loginUserForm.controls.password.setErrors(null);
            this.redirectAsPerQuery(response.path);
          },
          error: err => {
            this.disableVerifyPasswordButton = false;
            this.loginUserForm.controls.password.enable();

            this.serverError = err.error.message;
            this.loginUserForm.controls.password.setErrors({
              incorrect: true,
            });
          },
        });
    }
  }

  verifyUser() {
    this.disableVerifyUserButton = true;
    this.verifyUserForm.controls.username.disable();
    this.authService
      .verifyUser(this.verifyUserForm.controls.username.value)
      .subscribe({
        next: (response: any) => {
          this.verifyUserForm.controls.username.setErrors(null);
          this.loginUserForm.controls.username.setValue(
            this.verifyUserForm.controls.username.value,
          );
          this.hideUsername = true;
          this.hidePassword = false;
          this.enable2fa = response.user.enable2fa;
          this.enablePasswordLess = response.user.enablePasswordLess;
          this.disableLoginChoice = this.enablePasswordLess;
          // TODO: https://github.com/angular/angular/issues/12463
          setTimeout(() => this.passwordRef.nativeElement.focus());

          this.disableVerifyUserButton = false;
          this.verifyUserForm.controls.username.enable();
        },
        error: err => {
          this.disableVerifyUserButton = false;
          this.verifyUserForm.controls.username.enable();
          this.serverError = err.error.message;
          this.verifyUserForm.controls.username.setErrors({ incorrect: true });
        },
      });
  }

  forgotPassword() {
    this.authService
      .forgotPassword(this.loginUserForm.controls.username.value)
      .subscribe({
        next: success => {
          this.snackBar.open(PLEASE_CHECK_EMAIL, CLOSE, { duration: DURATION });
          window.location.href = '/login';
        },
        error: error =>
          this.snackBar.open(PLEASE_CHECK_USERNAME, CLOSE, {
            duration: DURATION,
          }),
      });
  }

  resendOTP() {
    this.disableResendOTP = true;
    this.authService
      .sendOTP(this.loginUserForm.controls.username.value)
      .subscribe({
        next: success => (this.disableResendOTP = false),
        error: error => {},
      });
  }

  connectWith(login) {
    let redirect = '/account';
    const query: any = { ...this.route.snapshot.queryParamMap };

    if (this.redirect) {
      redirect = this.redirect;
    }

    if (!this.redirect && query.params) {
      const params = new URLSearchParams();
      for (const key in query.params) {
        if (query.params.hasOwnProperty(key)) {
          params.set(key, query.params[key]);
        }
      }

      redirect = '/account/choose?' + params.toString();
    }

    window.location.href =
      '/social_login/callback/' +
      login.uuid +
      '?redirect=' +
      encodeURIComponent(redirect);
  }

  getSocialLogins() {
    return this.authService.getSocialLogins().subscribe({
      next: (response: { name: string; uuid: string }[]) => {
        this.socialLogins = response;
        if (this.socialLogins.length > 0) {
          this.showSocialLogins = true;
        }
      },
      error: err => {
        // TODO: Handle Error UI/UX
      },
    });
  }

  showPasswordLessLogin() {
    this.loginChoice = LoginChoice.PasswordLess;
    this.hidePassword = true;
    this.hideCode = false;
    this.resendOTP();
  }

  webAuthnLogin() {
    this.authService
      .webAuthnLogin(this.loginUserForm.controls.username.value, this.redirect)
      .subscribe({
        next: response => {
          this.redirectAsPerQuery(response.redirect);
        },
        error: error => {
          this.snackBar.open(
            error?.error?.message || NO_KEYS_REGISTERED,
            CLOSE,
            {
              duration: DURATION,
            },
          );
        },
      });
  }

  chooseAccount() {
    const query = { ...this.route.snapshot.queryParams };
    delete query.login_type;
    this.router.navigate(['/account/choose'], { queryParams: query });
  }

  getBrandInfo() {
    this.brandInfoService.retrieveBrandInfo().subscribe({
      next: brand => (this.logoURL = brand.logoURL),
      error: error => {},
    });
  }

  redirectAsPerQuery(redirectPath: string) {
    const loginType = this.route.snapshot.queryParams.login_type;
    if (!loginType) {
      window.location.href = redirectPath;
    } else if (loginType === 'add_account') {
      this.chooseAccount();
    }
  }

  clearLoginForm() {
    this.hideUsername = false;
    this.hidePassword = true;
    this.hideCode = true;
  }

  togglePassHidden() {
    this.isPassHidden = !this.isPassHidden;
  }
}
