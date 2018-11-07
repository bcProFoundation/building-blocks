import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // Declared Public to allow Ahead of Time compilation for production
  public username: string = '';
  public password: string = '';
  public code: string = '';

  hideUsername: boolean = false;
  hidePassword: boolean = true;
  hideCode: boolean = true;
  enable2fa: boolean = false;

  verifyUserForm = new FormGroup({
    username: new FormControl(this.username),
    password: new FormControl(this.password),
  });

  submitOTPForm = new FormGroup({
    code: new FormControl(this.code),
  });

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onSubmitOTP() {
    this.authService.logIn(
      this.verifyUserForm.controls.username.value,
      this.verifyUserForm.controls.password.value,
      this.submitOTPForm.controls.code.value,
    );
  }

  onSubmitPassword() {
    if (this.enable2fa) {
      this.hideCode = false;
      this.hidePassword = true;
    } else {
      this.authService.logIn(
        this.verifyUserForm.controls.username.value,
        this.verifyUserForm.controls.password.value,
      );
    }
  }

  verifyUser() {
    this.authService
      .verifyUser(this.verifyUserForm.controls.username.value)
      .subscribe({
        next: (response: any) => {
          this.hideUsername = true;
          this.hidePassword = false;
          this.enable2fa = response.user.enable2fa;
        },
        error: err => {},
      });
  }

  forgotPassword() {
    // communicationServer.recoveryEmail
  }

  resendOTP() {
    // communicationServer.sendOTP
  }
}
