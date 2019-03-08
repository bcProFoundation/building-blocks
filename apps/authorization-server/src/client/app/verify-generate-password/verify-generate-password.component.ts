import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VerifyGeneratePasswordService } from './verify-generate-password.service';
import { MatSnackBar } from '@angular/material';
import { CLOSE, INVALID_VERIFICATION_CODE } from '../../constants/app-strings';

@Component({
  selector: 'app-verify-generate-password',
  templateUrl: './verify-generate-password.component.html',
  styleUrls: ['./verify-generate-password.component.css'],
})
export class VerifyGeneratePasswordComponent implements OnInit {
  verificationCode: string;
  newPassword: string;
  repeatPassword: string;
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
            let message = INVALID_VERIFICATION_CODE;
            if (error.error.length > 0) {
              message = error.error[0];
            }
            this.snackBar.open(message, CLOSE, { duration: 2000 });
          },
        });
    }
  }
}
