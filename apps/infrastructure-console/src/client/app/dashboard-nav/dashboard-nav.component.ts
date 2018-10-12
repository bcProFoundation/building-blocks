import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

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
  constructor(
    private breakpointObserver: BreakpointObserver,
    private oauthService: OAuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.oauthService.events.subscribe(({ type }: OAuthEvent) => {
      // Silent Refresh
      switch (type) {
        case 'token_received':
          this.tokenIsValid = true;
          this.router.navigate(['dashboard']);
          break;
        // default:
        //   if (this.tokenIsValid) this.router.navigate(['dashboard']);
      }
    });
    this.tokenIsValid = this.oauthService.hasValidAccessToken();
  }

  login() {
    this.oauthService.initImplicitFlow();
  }

  logout() {
    this.oauthService.logOut();
  }
}
