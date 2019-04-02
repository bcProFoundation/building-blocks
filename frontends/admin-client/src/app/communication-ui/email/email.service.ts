import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {
  HandleError,
  HttpErrorHandler,
} from '../../common/services/http-error-handler/http-error-handler.service';
import { StorageService } from '../../common/services/storage/storage.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { COMMUNICATION_SERVER } from '../../constants/storage';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CANNOT_FETCH_MODELS } from '../../constants/messages';

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
    name: string,
    host: string,
    port: number,
    user: string,
    pass: string,
    from: string,
  ) {
    const url = `${this.storageService.getServiceURL(
      COMMUNICATION_SERVER,
    )}/email/v1/create`;
    const emailData = {
      name,
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
    const url = `${this.storageService.getServiceURL(
      COMMUNICATION_SERVER,
    )}/email/v1/get/${uuid}`;
    return this.http
      .get<string>(url, { headers: this.authorizationHeader })
      .pipe(
        catchError(
          this.handlerror('getRole', { message: CANNOT_FETCH_MODELS }),
        ),
      );
  }

  getEmails() {
    const url = `${this.storageService.getServiceURL(
      COMMUNICATION_SERVER,
    )}/role/v1/find`;
    return this.http.get<string>(url);
  }

  updateEmail(
    uuid: string,
    name: string,
    host: string,
    port: number,
    user: string,
    pass: string,
    from: string,
  ) {
    const url = `${this.storageService.getServiceURL(
      COMMUNICATION_SERVER,
    )}/email/v1/update`;
    const emailData = {
      uuid,
      name,
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
