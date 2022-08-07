import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, timer } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ServerInfo } from '../common/server-info.interface';
import {
  CLOSE,
  LONG_DURATION,
  PLEASE_CHECK_EMAIL,
} from '../constants/app-strings';
import { OTP_SENT_TO } from '../constants/messages';
import { SignupService } from './signup.service';

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
  redirect: string;
  isEmailDisabled = false;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private signupService: SignupService,
    private router: Router,
    private route: ActivatedRoute,
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
    this.route.queryParams
      .pipe(
        filter(params => params.redirect),
        map(params => params.redirect),
      )
      .subscribe(redirect => {
        this.redirect = redirect;
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
        this.redirect,
      )
      .subscribe({
        next: (response: any) => {
          this.isNameAndPhoneDisabled = true;
          this.isEmailDisabled = true;
          this.snackBar.open(PLEASE_CHECK_EMAIL, CLOSE, {
            duration: LONG_DURATION,
          });
          this.redirectAfterSignup();
        },
        error: err => {
          if (typeof err.error.message === 'string') {
            this.snackBar.open(err.error.message, null, {
              duration: LONG_DURATION,
            });
          } else {
            this.snackBar.open(err?.error?.message || err?.toString(), null, {
              duration: LONG_DURATION,
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
          duration: LONG_DURATION,
        });
        this.isNameAndPhoneDisabled = true;
        this.redirectAfterSignup();
      },
      error: error => {
        this.snackBar.open(error?.error?.message || error?.toString(), null, {
          duration: LONG_DURATION,
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
          duration: LONG_DURATION,
        });
      },
    });
  }

  redirectAfterSignup() {
    timer(LONG_DURATION).subscribe(() => {
      if (this.redirect) {
        window.location.href = this.redirect;
      } else {
        this.router.navigateByUrl('/account');
      }
    });
  }
}
