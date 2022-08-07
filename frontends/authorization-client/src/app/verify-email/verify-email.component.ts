import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, timer } from 'rxjs';
import {
  INFINITE_DURATION,
  LONG_DURATION,
  SOMETHING_WENT_WRONG,
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
  redirect: string;

  constructor(
    private route: ActivatedRoute,
    private verifyGeneratePassword: VerifyGeneratePasswordService,
    private router: Router,
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

    if (this.verificationCode) {
      this.verifyGeneratePassword.verifyEmail(this.verificationCode).subscribe({
        next: success => {
          this.snackBar.open(EMAIL_VERIFIED, undefined, {
            duration: INFINITE_DURATION,
          });
          this.redirectAfterVerification();
        },
        error: error => {
          this.snackBar.open(
            error?.error?.message || error?.toString() || SOMETHING_WENT_WRONG,
            undefined,
            { duration: INFINITE_DURATION },
          );
        },
      });
    }
  }

  redirectAfterVerification() {
    timer(LONG_DURATION).subscribe(() => {
      if (this.redirect) {
        window.location.href = this.redirect;
      } else {
        this.router.navigateByUrl('/verify');
      }
    });
  }
}
