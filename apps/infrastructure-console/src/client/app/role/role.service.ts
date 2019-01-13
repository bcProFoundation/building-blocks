import { Injectable } from '@angular/core';
import {
  HandleError,
  HttpErrorHandler,
} from '../common/http-error-handler.service';
import { StorageService } from '../common/storage.service';
import { ISSUER_URL } from '../constants/storage';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CANNOT_FETCH_CLIENT } from '../constants/messages';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private handlerror: HandleError;
  authorizationHeader: HttpHeaders;
  constructor(
    private readonly http: HttpClient,
    httpErrorHandler: HttpErrorHandler,
    private storageService: StorageService,
    private oauthService: OAuthService,
  ) {
    this.authorizationHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.oauthService.getAccessToken(),
    });
    this.handlerror = httpErrorHandler.createHandleError('RoleService');
  }

  createRole(roleName: string) {
    const url = `${this.storageService.getInfo(ISSUER_URL)}/role/v1/create`;
    const clientData = {
      name: roleName,
    };
    return this.http.post(url, clientData, {
      headers: this.authorizationHeader,
    });
  }

  getRole(role: string): Observable<any> {
    const url = `${this.storageService.getInfo(ISSUER_URL)}/role/v1/${role}`;
    return this.http
      .get<string>(url, { headers: this.authorizationHeader })
      .pipe(
        catchError(
          this.handlerror('getRole', { message: CANNOT_FETCH_CLIENT }),
        ),
      );
  }

  getRoles() {
    const url = `${this.storageService.getInfo(ISSUER_URL)}/role/v1/find`;
    return this.http.get<string>(url);
  }

  updateRole(uuid: string, roleName: string) {
    const url = `${this.storageService.getInfo(
      ISSUER_URL,
    )}/role/v1/update/${uuid}`;
    const roleData = {
      name: roleName,
    };
    return this.http.post(url, roleData, {
      headers: this.authorizationHeader,
    });
  }
}
