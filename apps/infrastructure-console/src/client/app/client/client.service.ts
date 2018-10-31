import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleError, HttpErrorHandler } from '../http-error-handler.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StorageService } from '../common/storage.service';
import { ISSUER_URL } from '../constants/storage';
import { CANNOT_FETCH_CLIENT } from '../constants/messages';

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
    const url = `${this.storageService.getInfo(ISSUER_URL)}/client/${clientID}`;
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
    callbackURLs: string[],
    scopes: string[],
    isTrusted: boolean,
  ) {
    const url = `${this.storageService.getInfo(ISSUER_URL)}/client/create`;
    const clientData = {
      name: clientName,
      redirectUris: callbackURLs,
      allowedScopes: scopes,
      isTrusted,
    };
    return this.http.post(url, clientData);
  }

  updateClient(
    clientId: string,
    clientName: string,
    callbackURLs: string[],
    scopes: string[],
    isTrusted: boolean,
  ) {
    const url = `${this.storageService.getInfo(ISSUER_URL)}/client/update`;
    const clientData = {
      clientId,
      name: clientName,
      redirectUris: callbackURLs,
      allowedScopes: scopes,
      isTrusted,
    };
    return this.http.post(url, clientData);
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
    const url = `${this.storageService.getInfo(ISSUER_URL)}/scope/find`;
    return this.http.get<string>(url);
  }
}
