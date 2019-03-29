import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { IDTokenClaims } from '../interfaces/id-token-claims.interfaces';
import { ADMINISTRATOR } from '../constants/roles';
import { LOGIN_AS_ADMINISTRATOR } from '../constants/messages';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  message: string;
  constructor(private oauthService: OAuthService) {}

  ngOnInit() {
    const idClaims: IDTokenClaims = this.oauthService.getIdentityClaims() || {
      roles: [],
    };
    if (!idClaims.roles.includes(ADMINISTRATOR)) {
      this.message = LOGIN_AS_ADMINISTRATOR;
    }
  }
}
