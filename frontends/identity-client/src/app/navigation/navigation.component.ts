import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { NavigationService } from './navigation.service';
import {
  ISSUER_URL,
  APP_URL,
  ENABLE_CHOOSING_ACCOUNT,
  USER_UUID,
  CLEAR_SESSION,
} from '../constants/storage';
import { LOGOUT_URL } from '../constants/url-paths';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  enableChoosingAccount =
    localStorage.getItem(ENABLE_CHOOSING_ACCOUNT) === 'true';
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  tokenIsValid: boolean;
  avatar: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private oauthService: OAuthService,
    private router: Router,
    private navigationService: NavigationService,
  ) {}

  ngOnInit(): void {
    this.oauthService.events.subscribe({
      next: ({ type }: OAuthEvent) => {
        switch (type) {
          case 'token_received':
            if (!this.tokenIsValid) {
              this.tokenIsValid = true;
              this.router.navigate(['profile']);
            }
            break;
          case 'token_expires':
            setTimeout(() => {
              this.oauthService.customQueryParams = {
                ...this.oauthService.customQueryParams,
                redirect_uri: this.oauthService.redirectUri,
              };
              this.oauthService.refreshToken();
            }, 1000);
            break;
        }
      },
      error: error => {},
    });
    this.tokenIsValid = this.oauthService.hasValidAccessToken();
  }

  onActivate(profileComponent: ProfileComponent) {
    if (profileComponent && profileComponent.messageEvent) {
      profileComponent.messageEvent.subscribe({
        next: avatar => (this.avatar = avatar),
        error: error => {},
      });
    }
  }

  login() {
    this.oauthService.initImplicitFlow();
  }

  logout() {
    const logoutUrl =
      localStorage.getItem(ISSUER_URL) +
      '/auth/logout?redirect=' +
      localStorage.getItem(APP_URL);
    this.navigationService.clearInfoLocalStorage();
    this.oauthService.logOut();
    this.tokenIsValid = false;
    window.location.href = logoutUrl;
  }

  chooseAccount() {
    const appURL = localStorage.getItem(APP_URL);
    localStorage.setItem(CLEAR_SESSION, 'true');
    window.open(appURL, '_blank');
  }

  logoutCurrentUser() {
    const issuerURL = localStorage.getItem(ISSUER_URL);
    const userUUID = sessionStorage.getItem(USER_UUID);
    const appURL = localStorage.getItem(APP_URL);
    const logoutURL =
      issuerURL +
      LOGOUT_URL +
      '/' +
      userUUID +
      '?redirect=' +
      encodeURIComponent(appURL);

    sessionStorage.clear();
    window.location.href = logoutURL;
  }
}
