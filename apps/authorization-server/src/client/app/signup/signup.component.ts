import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material';
import { SOMETHING_WENT_WRONG } from '../../../client/constants/messages';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  public name: string;
  public email: string;
  public phone: string;
  public password: string;

  ngOnInit() {}

  onSubmit() {
    this.authService
      .signUp(this.name, this.email, this.phone, this.password)
      .subscribe({
        next: (response: any) => {},
        error: err => {
          if (typeof err.error.message === 'string') {
            this.snackBar.open(err.error.message);
          } else {
            this.snackBar.open(SOMETHING_WENT_WRONG);
          }
        },
      });
  }
}
