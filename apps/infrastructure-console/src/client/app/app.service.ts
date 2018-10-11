import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleError, HttpErrorHandler } from './http-error-handler.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AppService {
  messageUrl = '/info'; // URL to web api
  private handleError: HandleError;

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('AppService');
  }

  /** GET message from the server */
  getMessage(): Observable<any> {
    return this.http
      .get<string>(this.messageUrl)
      .pipe(
        catchError(this.handleError('getMessage', { message: 'disconnected' })),
      );
  }
}
