import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {
  HttpErrorHandler,
  HandleError,
} from '../common/http-error-handler.service';
import { StorageService } from '../common/storage.service';
import { Observable } from 'rxjs';
import { ISSUER_URL } from '../constants/storage';
import { catchError } from 'rxjs/operators';
import { CANNOT_FETCH_CLIENT } from '../constants/messages';
import { Scope } from './scope.interface';

@Injectable({
  providedIn: 'root',
})
export class ScopeService {
  private handleError: HandleError;
  authorizationHeader: HttpHeaders;
  constructor(
    private readonly http: HttpClient,
    httpErrorHandler: HttpErrorHandler,
    private storageService: StorageService,
  ) {
    this.handleError = httpErrorHandler.createHandleError('UserService');
  }

  getScope(uuid: string): Observable<any> {
    const url = `${this.storageService.getInfo(ISSUER_URL)}/scope/v1/${uuid}`;
    return this.http
      .get<string>(url)
      .pipe(
        catchError(
          this.handleError('getUser', { message: CANNOT_FETCH_CLIENT }),
        ),
      );
  }

  updateScope(uuid: string, name: string, description: string) {
    const url = `${this.storageService.getInfo(ISSUER_URL)}/scope/v1/update`;

    const userData: Scope = {
      uuid,
      name,
      description,
    };

    return this.http.post(url, userData);
  }

  createScope(name: string, description: string) {
    const url = `${this.storageService.getInfo(ISSUER_URL)}/scope/v1/create`;
    const scopeData = {
      name,
      description,
    };
    return this.http.post(url, scopeData, {
      headers: this.authorizationHeader,
    });
  }
}
