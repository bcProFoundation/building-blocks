import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { SOMETHING_WENT_WRONG } from '../../../client/constants/messages';
import { SignupService } from './signup.service';
import { ServerInfo } from '../../common/server-info.interface';

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
          window.location.href = '/login';
        },
        error: err => {
          if (typeof err.error.message === 'string') {
            this.snackBar.open(err.error.message, null, { duration: 2500 });
          } else {
            this.snackBar.open(SOMETHING_WENT_WRONG);
          }
        },
      });
  }
}
