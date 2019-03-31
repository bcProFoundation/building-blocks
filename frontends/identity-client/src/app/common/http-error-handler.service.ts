import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { MessageService } from './message.service';

// HandleError creates conflict between prettier & ts-line
export type HandleError = <T>(
  operation?: string,
  result?: T,
) => (error: HttpErrorResponse) => Observable<T>; // tslint:disable-line

@Injectable()
export class HttpErrorHandler {
  constructor(private messageService: MessageService) {}

  // createHandleError creates conflict between prettier & ts-line
  createHandleError = (serviceName = '') => <T>(
    operation = 'operation',
    result = {} as T,
  ) => this.handleError(serviceName, operation, result); // tslint:disable-line

  handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      const message =
        error.error instanceof ErrorEvent
          ? error.error.message
          : `server returned code ${error.status} with body "${error.error}"`;
      this.messageService.add(
        `${serviceName}: ${operation} failed: ${message}`,
      );
      return of(result as any);
    };
  }
}
