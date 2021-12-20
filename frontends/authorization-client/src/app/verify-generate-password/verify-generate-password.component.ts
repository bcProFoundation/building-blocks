import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VerifyGeneratePasswordService } from './verify-generate-password.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  CLOSE,
  SOMETHING_WENT_WRONG,
  DURATION,
  NEW_PASSWORD_MISMATCH,
} from '../constants/app-strings';

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

  constructor(
    private route: ActivatedRoute,
    private verifyGeneratePassword: VerifyGeneratePasswordService,
    private snackBar: MatSnackBar,
  ) {
    this.verificationCode = this.route.snapshot.params.code;
  }

  ngOnInit() {}

  onSubmit() {
    if (this.newPassword === this.repeatPassword) {
      this.verifyGeneratePassword
        .updateUser(this.verificationCode, this.newPassword)
        .subscribe({
          next: response => {
            window.location.href = '/login';
          },
          error: error => {
            let message = error?.error?.message || SOMETHING_WENT_WRONG;
            if (Array.isArray(error.error.message)) {
              message = error.error.message[0];
            }
            this.snackBar.open(message, CLOSE, { duration: DURATION });
          },
        });
    } else {
      this.snackBar.open(NEW_PASSWORD_MISMATCH, CLOSE, { duration: DURATION });
    }
  }
}
