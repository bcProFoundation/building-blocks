import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  HandleError,
  HttpErrorHandler,
} from '../../common/services/http-error-handler/http-error-handler.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StorageService } from '../../common/services/storage/storage.service';
import { ISSUER_URL } from '../../constants/storage';
import { CANNOT_FETCH_CLIENT } from '../../constants/messages';
import { ClientAuthentication } from './client-authentication.enum';

@Injectable()
export class ClientService {
  private handleError: HandleError;

  constructor(
    private readonly http: HttpClient,
    httpErrorHandler: HttpErrorHandler,
    private storageService: StorageService,
  ) {
    this.handleError = httpErrorHandler.createHandleError('ClientService');
  }

  getClient(clientID: string): Observable<any> {
    const url = `${this.storageService.getInfo(
      ISSUER_URL,
    )}/client/v1/get/${clientID}`;
    return this.http
      .get<string>(url)
      .pipe(
        catchError(
          this.handleError('getClient', { message: CANNOT_FETCH_CLIENT }),
        ),
      );
  }

  verifyClient(clientURL: string) {
    const url = `${clientURL}/info`;
    return this.http.get<string>(url);
  }

  createClient(
    clientName: string,
    authenticationMethod: ClientAuthentication,
    callbackURLs: string[],
    scopes: string[],
    isTrusted: string,
    autoApprove: boolean,
  ) {
    const url = `${this.storageService.getInfo(ISSUER_URL)}/client/v1/create`;
    const clientData = {
      name: clientName,
      authenticationMethod,
      redirectUris: callbackURLs,
      allowedScopes: scopes,
      isTrusted,
      autoApprove,
    };
    return this.http.post(url, clientData);
  }

  updateClient(
    clientId: string,
    clientName: string,
    authenticationMethod: ClientAuthentication,
    tokenDeleteEndpoint: string,
    userDeleteEndpoint: string,
    callbackURLs: string[],
    scopes: string[],
    isTrusted: string,
    autoApprove: boolean,
  ) {
    const url = `${this.storageService.getInfo(
      ISSUER_URL,
    )}/client/v1/update/${clientId}`;
    return this.http.post(url, {
      name: clientName,
      authenticationMethod,
      tokenDeleteEndpoint,
      userDeleteEndpoint,
      redirectUris: callbackURLs,
      allowedScopes: scopes,
      isTrusted,
      autoApprove,
    });
  }

  invokeSetup(clientURL: string, savedClient: any) {
    const payload = {
      appURL: clientURL,
      authServerURL: this.storageService.getInfo(ISSUER_URL),
      clientId: savedClient.clientId,
      clientSecret: savedClient.clientSecret,
      callbackURLs: savedClient.redirectUris,
    };
    const url = `${clientURL}/setup`;
    return this.http.post(url, payload);
  }

  getScopes() {
    const url = `${this.storageService.getInfo(ISSUER_URL)}/scope/v1/find`;
    return this.http.get<string>(url);
  }

  deleteClient(clientId: string) {
    const url = `${this.storageService.getInfo(
      ISSUER_URL,
    )}/client/v1/delete/${clientId}`;
    return this.http.post(url, undefined);
  }
}
