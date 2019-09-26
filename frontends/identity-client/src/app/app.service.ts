import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  HandleError,
  HttpErrorHandler,
} from './common/http-error-handler.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {
  CLIENT_ID,
  REDIRECT_URI,
  SILENT_REFRESH_REDIRECT_URI,
  LOGIN_URL,
  ISSUER_URL,
  APP_URL,
  COMMUNICATION_SERVER,
  COMMUNICATION_SERVER_URL,
  ENABLE_CHOOSING_ACCOUNT,
} from './constants/storage';
import { INFO_ENDPOINT } from './constants/url-paths';

@Injectable()
export class AppService {
  private handleError: HandleError;

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('AppService');
  }

  /** GET message from the server */
  getMessage(): Observable<any> {
    return this.http.get<any>(INFO_ENDPOINT).pipe(
      switchMap(response => {
        return this.http.get<any>(response.authServerURL + INFO_ENDPOINT).pipe(
          switchMap(data => {
            data.services.forEach(element => {
              if (element.type === COMMUNICATION_SERVER) {
                localStorage.setItem(COMMUNICATION_SERVER_URL, element.url);
              }
            });
            localStorage.setItem(
              ENABLE_CHOOSING_ACCOUNT,
              data.enableChoosingAccount,
            );
            return of(response);
          }),
        );
      }),
      catchError(this.handleError('getMessage', { message: 'disconnected' })),
    );
  }

  setInfoLocalStorage(response) {
    localStorage.setItem(CLIENT_ID, response.clientId);
    localStorage.setItem(REDIRECT_URI, response.callbackURLs[0]);
    localStorage.setItem(SILENT_REFRESH_REDIRECT_URI, response.callbackURLs[1]);
    localStorage.setItem(LOGIN_URL, response.authorizationURL);
    localStorage.setItem(ISSUER_URL, response.authServerURL);
    localStorage.setItem(APP_URL, response.appURL);
  }
}
