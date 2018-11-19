import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { APP_URL } from '../constants/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CANNOT_FETCH_MODELS } from '../constants/messages';
import { HandleError, HttpErrorHandler } from '../http-error-handler.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  private handleError: HandleError;
  headers: HttpHeaders;

  constructor(
    private storageService: StorageService,
    httpErrorHandler: HttpErrorHandler,
    private http: HttpClient,
    private oauthService: OAuthService,
  ) {
    this.handleError = httpErrorHandler.createHandleError('ListingService');
    this.headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.oauthService.getAccessToken(),
    });
  }

  getModels(
    skip: number,
    take: number,
    search: string,
    model: string,
  ): Observable<any> {
    const appUrl = this.storageService.getInfo(APP_URL);
    const url = `${appUrl}/${model}/v1/list?take=${take}&skip=${skip}&search=${search}`;
    return this.http
      .get<string>(url, { headers: this.headers })
      .pipe(
        catchError(
          this.handleError('getModels', { message: CANNOT_FETCH_MODELS }),
        ),
      );
  }
}
