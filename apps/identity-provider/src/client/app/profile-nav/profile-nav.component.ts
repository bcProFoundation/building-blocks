import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-nav',
  templateUrl: './profile-nav.component.html',
  styleUrls: ['./profile-nav.component.css'],
})
export class ProfileNavComponent implements OnInit {
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
    this.oauthService.logOut();
    this.tokenIsValid = false;
    this.router.navigate(['home']);
  }
}
