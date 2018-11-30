import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { ISSUER_URL } from '../constants/storage';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  HandleError,
  HttpErrorHandler,
} from '../common/http-error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  handleError: HandleError;

  constructor(
    private storageService: StorageService,
    httpErrorHandler: HttpErrorHandler,
    private http: HttpClient,
  ) {
    this.handleError = httpErrorHandler.createHandleError('ListingService');
  }

  findModels(
    model: string,
    filter = '',
    sortOrder = 'asc',
    pageNumber = 0,
    pageSize = 10,
  ) {
    const issuer = this.storageService.getInfo(ISSUER_URL);
    const url = `${issuer}/${model}/v1/list`;
    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageNumber * pageSize).toString())
      .set('search', filter)
      .set('sort', sortOrder);
    return this.http.get(url, { params });
  }
}
