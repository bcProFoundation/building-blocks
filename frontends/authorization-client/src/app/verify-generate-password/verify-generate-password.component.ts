import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { filter, map, timer } from 'rxjs';
import {
  CLOSE,
  LONG_DURATION,
  NEW_PASSWORD_MISMATCH,
  SOMETHING_WENT_WRONG,
} from '../constants/app-strings';
import { PASSWORD_UPDATED } from '../constants/messages';
import { VerifyGeneratePasswordService } from './verify-generate-password.service';

@Component({
  selector: 'app-verify-generate-password',
  templateUrl: './verify-generate-password.component.html',
  styleUrls: ['./verify-generate-password.component.css'],
})
export class VerifyGeneratePasswordComponent implements OnInit {
  verificationCode: string;
  newPassword: string;
  repeatPassword: string;
  isNewPwHidden = true;
  isRepeatPwHidden = true;
  redirect: string;
  isFormDisabled = false;

  constructor(
    private route: ActivatedRoute,
    private verifyGeneratePassword: VerifyGeneratePasswordService,
    private snackBar: MatSnackBar,
  ) {
    this.verificationCode = this.route.snapshot.params.code;
  }

  ngOnInit() {
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
    if (this.newPassword === this.repeatPassword) {
      this.verifyGeneratePassword
        .updateUser(this.verificationCode, this.newPassword)
        .subscribe({
          next: response => {
            this.isFormDisabled = true;
            this.snackBar.open(PASSWORD_UPDATED, CLOSE, {
              duration: LONG_DURATION,
            });
            this.redirectAfterVerification();
          },
          error: error => {
            let message = error?.error?.message || SOMETHING_WENT_WRONG;
            if (Array.isArray(error.error.message)) {
              message = error.error.message[0];
            }
            this.snackBar.open(message, CLOSE, { duration: LONG_DURATION });
          },
        });
    } else {
      this.snackBar.open(NEW_PASSWORD_MISMATCH, CLOSE, {
        duration: LONG_DURATION,
      });
    }
  }

  redirectAfterVerification() {
    timer(LONG_DURATION).subscribe(() => {
      if (this.redirect) {
        window.location.href = this.redirect;
      } else {
        window.location.href = '/login';
      }
    });
  }
}
