import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  HandleError,
  HttpErrorHandler,
} from './common/services/http-error-handler/http-error-handler.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

@Injectable()
export class AppService {
  messageUrl = '/info'; // URL to web api
  private handleError: HandleError;

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('AppService');
  }

  /** GET message from the server */
  getMessage(): Observable<any> {
    return this.http.get<any>(this.messageUrl).pipe(
      switchMap(appInfo => {
        if (appInfo.message) {
          return of(appInfo);
        }
        return this.http.get<any>(appInfo.authServerURL + '/info').pipe(
          map(authInfo => {
            appInfo.services = authInfo.services;
            appInfo.communication = authInfo.communication;
            return appInfo;
          }),
        );
      }),
      catchError(this.handleError('info', { message: 'disconnected' })),
    );
  }
}
