import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HOME_TITLE } from '../constants/messages';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private title: Title,
    private oauth2: OAuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.title.setTitle(HOME_TITLE);
    if (this.oauth2.hasValidAccessToken()) {
      this.router.navigate(['profile']);
    }
  }
}
