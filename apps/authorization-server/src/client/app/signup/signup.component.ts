import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(private authService: AuthService) {}

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
        error: error => {},
      });
  }
}
