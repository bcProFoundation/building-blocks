import { Injectable } from '@angular/core';
import { HandleError, HttpErrorHandler } from '../http-error-handler.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { StorageService } from '../common/storage.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { APP_URL } from '../constants/storage';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CANNOT_FETCH_MODELS } from '../constants/messages';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
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

  createEmail(
    host: string,
    port: number,
    user: string,
    pass: string,
    from: string,
  ) {
    const url = `${this.storageService.getInfo(APP_URL)}/email/v1/create`;
    const emailData = {
      host,
      port,
      user,
      pass,
      from,
    };

    return this.http.post(url, emailData, {
      headers: this.authorizationHeader,
    });
  }

  getEmail(uuid: string): Observable<any> {
    const url = `${this.storageService.getInfo(APP_URL)}/email/v1/${uuid}`;
    return this.http
      .get<string>(url, { headers: this.authorizationHeader })
      .pipe(
        catchError(
          this.handlerror('getRole', { message: CANNOT_FETCH_MODELS }),
        ),
      );
  }

  getEmails() {
    const url = `${this.storageService.getInfo(APP_URL)}/role/v1/find`;
    return this.http.get<string>(url);
  }

  updateEmail(
    uuid: string,
    host: string,
    port: number,
    user: string,
    pass: string,
    from: string,
  ) {
    const url = `${this.storageService.getInfo(APP_URL)}/email/v1/update`;
    const emailData = {
      uuid,
      host,
      port,
      user,
      pass,
      from,
    };
    return this.http.post(url, emailData, {
      headers: this.authorizationHeader,
    });
  }
}
