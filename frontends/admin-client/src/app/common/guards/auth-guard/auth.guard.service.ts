import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { IDTokenClaims } from '../../../interfaces/id-token-claims.interfaces';
import { ADMINISTRATOR } from '../../../constants/roles';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private oauthService: OAuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const idClaims: IDTokenClaims = this.oauthService.getIdentityClaims();
    if (
      this.oauthService.hasValidIdToken() &&
      idClaims.roles.includes(ADMINISTRATOR)
    ) {
      return true;
    }

    this.router.navigate(['/home']);
    return false;
  }
}
