import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CLOSE, INVALID_VERIFICATION_CODE, LONG_DURATION } from '../constants/app-strings';
import { VerifyGeneratePasswordService } from '../verify-generate-password/verify-generate-password.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
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
    this.verifyGeneratePassword.verifyEmail(this.verificationCode).subscribe({
      next: success => {
        this.router.navigate(['/account']);
      },
      error: error => {
        const snack = this.snackBar.open(
          error?.error?.message || INVALID_VERIFICATION_CODE,
          CLOSE,
          { duration: LONG_DURATION },
        );
        snack.afterDismissed().subscribe({
          next: res => {
            this.router.navigate(['/']);
          }
        })
      },
    })
  }
}
