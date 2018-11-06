import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { StorageService } from '../common/storage.service';
import { ISSUER_URL, APP_URL } from '../constants/storage';
import { IDTokenClaims } from '../interfaces/id-token-claims.interfaces';
import { ADMINISTRATOR } from '../constants/roles';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  tokenIsValid: boolean;
  loggedIn: boolean;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private oauthService: OAuthService,
    private router: Router,
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
    this.oauthService.events.subscribe(({ type }: OAuthEvent) => {
      // Silent Refresh
      switch (type) {
        case 'token_received':
          this.setUserSession();
          this.router.navigate(['dashboard']);
          break;
      }
    });
    this.setUserSession();
  }

  login() {
    this.oauthService.initImplicitFlow();
  }

  logout() {
    const logOutUrl =
      this.storageService.getInfo(ISSUER_URL) +
      '/auth/logout?redirect=' +
      this.storageService.getInfo(APP_URL);
    this.storageService.clearInfoLocalStorage();
    this.oauthService.logOut();
    this.tokenIsValid = false;
    window.location.href = logOutUrl;
  }

  setUserSession() {
    const idClaims: IDTokenClaims = this.oauthService.getIdentityClaims() || {
      roles: [],
    };
    this.tokenIsValid = idClaims.roles.includes(ADMINISTRATOR);
    this.loggedIn = this.oauthService.hasValidAccessToken();
  }
}
