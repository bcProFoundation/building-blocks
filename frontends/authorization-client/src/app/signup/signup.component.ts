import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth/auth.service';
import { OTP_SENT_TO } from '../constants/messages';
import { SignupService } from './signup.service';
import { ServerInfo } from '../common/server-info.interface';
import {
  CLOSE,
  PLEASE_CHECK_EMAIL,
  DURATION,
  LONG_DURATION,
} from '../constants/app-strings';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  public name: string;
  public email: string;
  public phone: string;
  public password: string;
  public communicationEnabled: boolean = false;
  otp: string;
  enableUserPhone = false;
  isSignUpViaEmail = true;
  isSignUpViaPhone = false;
  isNameAndPhoneDisabled = false;
  isOTPSendButtonDisabled = false;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private signupService: SignupService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.signupService.getServerInfo().subscribe({
      next: (response: ServerInfo) => {
        if (response.communication) {
          this.communicationEnabled = response.communication;
          this.enableUserPhone = response.enableUserPhone;
        }
      },
    });
  }

  onSubmit() {
    this.authService
      .signUp(
        this.communicationEnabled,
        this.name,
        this.email,
        this.phone,
        this.password,
      )
      .subscribe({
        next: (response: any) => {
          this.snackBar.open(PLEASE_CHECK_EMAIL, CLOSE, { duration: DURATION });
          this.router.navigateByUrl('/account');
        },
        error: err => {
          if (typeof err.error.message === 'string') {
            this.snackBar.open(err.error.message, null, { duration: DURATION });
          } else {
            this.snackBar.open(err?.error?.message || err?.toString(), null, {
              duration: DURATION,
            });
          }
        },
      });
  }

  signUpViaPhone() {
    this.isNameAndPhoneDisabled = false;
    this.isSignUpViaEmail = !this.isSignUpViaEmail;
    this.isSignUpViaPhone = !this.isSignUpViaPhone;
  }

  onSubmitPhone() {
    this.isOTPSendButtonDisabled = true;
    setTimeout(() => (this.isOTPSendButtonDisabled = false), LONG_DURATION);
    this.authService.signUpViaPhone(this.name, this.phone).subscribe({
      next: success => {
        this.snackBar.open(OTP_SENT_TO + this.phone, null, {
          duration: DURATION,
        });
        this.isNameAndPhoneDisabled = true;
      },
      error: error => {
        this.snackBar.open(error?.error?.message || error?.toString(), null, {
          duration: DURATION,
        });
      },
    });
  }

  verifyPhoneSignup() {
    this.authService.verifySignupPhone(this.phone, this.otp).subscribe({
      next: success => {
        this.router.navigateByUrl('/account');
      },
      error: error => {
        this.snackBar.open(error?.error?.message || error?.toString(), null, {
          duration: DURATION,
        });
      },
    });
  }
}
