import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

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

  @ViewChild('password') passwordRef: ElementRef;
  @ViewChild('otp') otpRef: ElementRef;
  @ViewChild('username') usernameRef: ElementRef;

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
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit() {
    this.usernameRef.nativeElement.focus();
  }

  onSubmitOTP() {
    this.authService
      .logIn(
        this.verifyUserForm.controls.username.value,
        this.loginUserForm.controls.password.value,
        this.submitOTPForm.controls.code.value,
      )
      .subscribe({
        next: (response: any) => {
          this.submitOTPForm.controls.code.setErrors(null);
          window.location.href = response.path;
        },
        error: err => {
          this.serverError = err.error.message;
          this.submitOTPForm.controls.code.setErrors({ incorrect: true });
        },
      });
  }

  onSubmitPassword() {
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
            setTimeout(() => this.otpRef.nativeElement.focus());
          },
          error: err => {
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
            window.location.href = response.path;
          },
          error: err => {
            this.serverError = err.error.message;
            this.verifyUserForm.controls.password.setErrors({
              incorrect: true,
            });
          },
        });
    }
  }

  verifyUser() {
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

          // TODO: https://github.com/angular/angular/issues/12463
          setTimeout(() => this.passwordRef.nativeElement.focus());
        },
        error: err => {
          this.serverError = err.error.message;
          this.verifyUserForm.controls.username.setErrors({ incorrect: true });
        },
      });
  }

  forgotPassword() {
    // communicationServer.recoveryEmail
  }

  resendOTP() {
    // communicationServer.sendOTP
  }
}
