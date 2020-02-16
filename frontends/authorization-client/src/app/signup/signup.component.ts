import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SOMETHING_WENT_WRONG } from '../constants/messages';
import { SignupService } from './signup.service';
import { ServerInfo } from '../common/server-info.interface';
import { CLOSE, PLEASE_CHECK_EMAIL, DURATION } from '../constants/app-strings';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  public name: string;
  public email: string;
  public phone: string;
  public password: string;
  public communicationEnabled: boolean = false;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private signupService: SignupService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.signupService.getServerInfo().subscribe({
      next: (response: ServerInfo) => {
        if (response.communication) {
          this.communicationEnabled = response.communication;
        }
      },
    });
  }

  onSubmit() {
    this.authService
      .signUp(
        this.communicationEnabled,
        this.name,
        this.email,
        this.phone,
        this.password,
      )
      .subscribe({
        next: (response: any) => {
          this.snackBar.open(PLEASE_CHECK_EMAIL, CLOSE, { duration: DURATION });
          this.router.navigateByUrl('/login');
        },
        error: err => {
          if (typeof err.error.message === 'string') {
            this.snackBar.open(err.error.message, null, { duration: DURATION });
          } else {
            this.snackBar.open(SOMETHING_WENT_WRONG);
          }
        },
      });
  }
}
