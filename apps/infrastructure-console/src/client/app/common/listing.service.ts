import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { ISSUER_URL } from '../constants/storage';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HandleError, HttpErrorHandler } from '../http-error-handler.service';
import { Observable } from 'rxjs';
import { CANNOT_FETCH_MODELS } from '../constants/messages';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  private handleError: HandleError;

  constructor(
    private storageService: StorageService,
    httpErrorHandler: HttpErrorHandler,
    private http: HttpClient,
  ) {
    this.handleError = httpErrorHandler.createHandleError('ListingService');
  }

  getModels(
    offset: number,
    limit: number,
    search: string,
    model: string,
  ): Observable<any> {
    const issuer = this.storageService.getInfo(ISSUER_URL);
    const url = `${issuer}/${model}/v1/list?limit=${limit}&offset=${offset}&search=${search}`;
    return this.http
      .get<string>(url)
      .pipe(
        catchError(
          this.handleError('getModels', { message: CANNOT_FETCH_MODELS }),
        ),
      );
  }
}
