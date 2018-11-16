import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  HandleError,
  HttpErrorHandler,
} from './common/http-error-handler.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  CLIENT_ID,
  REDIRECT_URI,
  SILENT_REFRESH_REDIRECT_URI,
  LOGIN_URL,
  ISSUER_URL,
  APP_URL,
} from '../constants/storage';

@Injectable()
export class AppService {
  messageUrl = '/info'; // URL to web api
  private handleError: HandleError;

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('HeroesService');
  }

  /** GET message from the server */
  getMessage(): Observable<any> {
    return this.http
      .get<string>(this.messageUrl)
      .pipe(
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
