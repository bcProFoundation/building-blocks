import { Injectable } from '@angular/core';
import {
  HandleError,
  HttpErrorHandler,
} from '../../common/services/http-error-handler/http-error-handler.service';

import { StorageService } from '../../common/services/storage/storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { ISSUER_URL } from '../../constants/storage';
import { catchError } from 'rxjs/operators';
import { CANNOT_FETCH_CLIENT } from '../../constants/messages';
import { UserUpdate } from './user-update.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private handleError: HandleError;
  authorizationHeader: HttpHeaders;

  constructor(
    private readonly http: HttpClient,
    httpErrorHandler: HttpErrorHandler,
    private storageService: StorageService,
  ) {
    this.handleError = httpErrorHandler.createHandleError('UserService');
  }

  getUser(userID: string): Observable<any> {
    const url = `${this.storageService.getInfo(
      ISSUER_URL,
    )}/user/v1/get/${userID}`;
    return this.http
      .get<string>(url)
      .pipe(
        catchError(
          this.handleError('getUser', { message: CANNOT_FETCH_CLIENT }),
        ),
      );
  }

  verifyUser(userURL: string) {
    const url = `${userURL}/info`;
    return this.http.get<string>(url);
  }

  createUser(
    fullName: string,
    userEmail: string,
    userPhone: number,
    userPassword: string,
    userRole: string,
  ) {
    const url = `${this.storageService.getInfo(ISSUER_URL)}/user/v1/create`;
    const userData = {
      name: fullName,
      email: userEmail,
      phone: userPhone,
      password: userPassword,
      roles: userRole,
    };
    return this.http.post(url, userData);
  }

  updateUser(
    uuid: string,
    fullName: string,
    roles: string,
    password?: string,
    disabled = false,
  ) {
    const url = `${this.storageService.getInfo(
      ISSUER_URL,
    )}/user/v1/update/${uuid}`;

    const userData: UserUpdate = {
      name: fullName,
      roles,
      disabled,
    };

    if (password) userData.password = password;
    return this.http.put(url, userData);
  }

  invokeSetup(userURL: string, savedUser: any) {
    const payload = {
      appURL: userURL,
      authServerURL: this.storageService.getInfo(ISSUER_URL),
      uuid: savedUser.uuid,
      name: savedUser.name,
      role: savedUser.role,
    };
    const url = `${userURL}/setup`;
    return this.http.post(url, payload);
  }

  getRoles() {
    const url = `${this.storageService.getInfo(ISSUER_URL)}/role/v1/find`;
    return this.http.get<string>(url);
  }
}
