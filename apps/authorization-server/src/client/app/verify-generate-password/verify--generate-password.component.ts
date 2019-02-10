import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  constructor(
    private route: ActivatedRoute,
    private verifyGeneratePassword: VerifyGeneratePasswordService,
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
        });
    }
  }
}
