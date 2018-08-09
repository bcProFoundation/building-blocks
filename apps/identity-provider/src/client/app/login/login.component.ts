import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // Declared Public to allow Ahead of Time compilation for production
  public email: string = '';
  public password: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onSubmit() {
    this.authService.logIn(this.email, this.password);
  }
}
