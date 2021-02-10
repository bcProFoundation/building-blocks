import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {
  INFINITE_DURATION,
  INVALID_VERIFICATION_CODE,
} from '../constants/app-strings';
import { EMAIL_VERIFIED } from '../constants/messages';
import { VerifyGeneratePasswordService } from '../verify-generate-password/verify-generate-password.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent implements OnInit {
  verificationCode: string;

  constructor(
    private route: ActivatedRoute,
    private verifyGeneratePassword: VerifyGeneratePasswordService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.verificationCode = this.route.snapshot.params.code;
  }

  ngOnInit() {
    if (this.verificationCode) {
      this.verifyGeneratePassword.verifyEmail(this.verificationCode).subscribe({
        next: success => {
          this.snackBar.open(EMAIL_VERIFIED, undefined, {
            duration: INFINITE_DURATION,
          });
          this.router.navigate(['/verify']);
        },
        error: error => {
          this.snackBar.open(
            error?.error?.message ||
              error?.toString() ||
              INVALID_VERIFICATION_CODE,
            undefined,
            { duration: INFINITE_DURATION },
          );
        },
      });
    }
  }
}
