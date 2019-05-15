import { Injectable } from '@angular/core';
import { StorageService } from '../../common/services/storage/storage.service';
import {
  ISSUER_URL,
  COMMUNICATION_SERVER,
  APP_URL,
} from '../../constants/storage';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  HandleError,
  HttpErrorHandler,
} from '../../common/services/http-error-handler/http-error-handler.service';

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
    let baseUrl = this.storageService.getInfo(ISSUER_URL);

    if (['storage', 'email', 'oauth2_provider'].includes(model)) {
      baseUrl = this.storageService.getServiceURL(COMMUNICATION_SERVER);
    }

    if (['service', 'service_type'].includes(model)) {
      baseUrl = this.storageService.getInfo(APP_URL);
    }

    const url = `${baseUrl}/${model}/v1/list`;
    const params = new HttpParams()
      .set('limit', pageSize.toString())
      .set('offset', (pageNumber * pageSize).toString())
      .set('search', filter)
      .set('sort', sortOrder);
    return this.http.get(url, { params });
  }
}
