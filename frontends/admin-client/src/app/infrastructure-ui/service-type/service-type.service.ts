import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../../common/services/storage/storage.service';
import { Observable } from 'rxjs';
import { APP_URL } from 'src/app/constants/storage';
import { catchError } from 'rxjs/operators';
import { FETCH_ERROR } from '../../constants/messages';
import {
  HandleError,
  HttpErrorHandler,
} from 'src/app/common/services/http-error-handler/http-error-handler.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root',
})
export class ServiceTypeService {
  private handlerror: HandleError;
  authorizationHeader: HttpHeaders;
  constructor(
    private readonly http: HttpClient,
    httpErrorHandler: HttpErrorHandler,
    private storageService: StorageService,
    private oauthService: OAuthService,
  ) {
    this.authorizationHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.oauthService.getAccessToken(),
    });
    this.handlerror = httpErrorHandler.createHandleError('RoleService');
  }

  getServiceType(uuid: string): Observable<any> {
    const url = `${this.storageService.getInfo(
      APP_URL,
    )}/service_type/v1/get_by_uuid/${uuid}`;
    return this.http
      .get<any>(url, { headers: this.authorizationHeader })
      .pipe(
        catchError(this.handlerror('getServiceType', { message: FETCH_ERROR })),
      );
  }

  createServiceType(serviceTypeName: string) {
    const url = `${this.storageService.getInfo(
      APP_URL,
    )}/service_type/v1/create`;
    const serviceTypeData = {
      name: serviceTypeName,
    };
    return this.http.post(url, serviceTypeData, {
      headers: this.authorizationHeader,
    });
  }

  deleteServiceType(name: string) {
    const url = `${this.storageService.getInfo(
      APP_URL,
    )}/service_type/v1/delete/${name}`;
    return this.http.post(url, undefined, {
      headers: this.authorizationHeader,
    });
  }
}
