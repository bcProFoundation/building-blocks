import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VerifySignupService } from './verify-signup.service';

@Component({
  selector: 'app-verify-signup',
  templateUrl: './verify-signup.component.html',
  styleUrls: ['./verify-signup.component.css'],
})
export class VerifySignupComponent implements OnInit {
  verificationCode: string;
  newPassword: string;
  repeatPassword: string;
  constructor(
    private route: ActivatedRoute,
    private verifySignup: VerifySignupService,
  ) {
    this.verificationCode = this.route.snapshot.params.code;
  }

  ngOnInit() {}

  onSubmit() {
    if (this.newPassword === this.repeatPassword) {
      this.verifySignup
        .updateUser(this.verificationCode, this.newPassword)
        .subscribe({
          next: response => {
            window.location.href = '/login';
          },
        });
    }
  }
}
