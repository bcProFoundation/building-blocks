import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

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

  showUsername: boolean = true;
  showPassword: boolean = false;
  showCode: boolean = false;
  enable2fa: boolean = false;

  // TODO: REplace with proper validation. Quick Poc sin:
  formError: string;

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onSubmit() {
    if (!this.enable2fa) {
      this.authService.logIn(this.username, this.password);
    } else if (!this.code) {
      this.showPassword = false;
      this.showCode = true;
    } else {
      this.authService.logIn(this.username, this.password, this.code);
    }
  }

  verifyUser() {
    this.authService.verifyUser(this.username).subscribe({
      next: (response: any) => {
        this.formError = '';
        this.showUsername = false;
        this.showPassword = true;
        this.enable2fa = response.user.enable2fa;
      },
      error: err => {
        this.formError = err.error.message;
      },
    });
  }

  forgotPassword() {
    // communicationServer.recoveryEmail
  }

  resendOTP() {
    // communicationServer.sendOTP
  }
}
