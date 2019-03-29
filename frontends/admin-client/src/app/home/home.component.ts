import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private oauthService: OAuthService, private router: Router) {}

  ngOnInit() {
    if (this.oauthService.hasValidAccessToken()) {
      this.router.navigate(['dashboard']);
    }
  }
}
