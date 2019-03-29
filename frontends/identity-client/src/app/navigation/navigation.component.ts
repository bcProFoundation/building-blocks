import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { NavigationService } from './navigation.service';
import { ISSUER_URL, APP_URL } from '../constants/storage';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  tokenIsValid: boolean;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private oauthService: OAuthService,
    private router: Router,
    private navigationService: NavigationService,
  ) {}

  ngOnInit(): void {
    this.oauthService.events.subscribe(({ type }: OAuthEvent) => {
      switch (type) {
        case 'token_received':
          this.tokenIsValid = true;
          this.router.navigate(['profile']);
          break;
      }
    });
    this.tokenIsValid = this.oauthService.hasValidAccessToken();
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
}
