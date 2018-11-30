import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { Router, NavigationEnd } from '@angular/router';
import { StorageService } from '../common/storage.service';
import { ISSUER_URL, APP_URL } from '../constants/storage';
import { IDTokenClaims } from '../interfaces/id-token-claims.interfaces';
import { ADMINISTRATOR } from '../constants/roles';

@Component({
  selector: 'app-dashboard-nav',
  templateUrl: './dashboard-nav.component.html',
  styleUrls: ['./dashboard-nav.component.css'],
})
export class DashboardNavComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  tokenIsValid: boolean;
  loggedIn: boolean;
  route: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private oauthService: OAuthService,
    private router: Router,
    private storageService: StorageService,
  ) {
    this.router.events
      .pipe(filter(route => route instanceof NavigationEnd))
      .subscribe((route: NavigationEnd) => {
        this.route = route.url;
      });
  }

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

  addModel() {
    // TODO: make it better in UI/UX
    const routeArray = this.route.split('/');
    const index = routeArray.indexOf('list');
    if (index !== -1) routeArray[index] = 'new';
    this.router.navigate(routeArray);
  }
}
