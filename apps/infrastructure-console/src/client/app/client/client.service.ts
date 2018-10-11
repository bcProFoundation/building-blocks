import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HandleError, HttpErrorHandler } from '../http-error-handler.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { APP_INFO } from '../constants';

@Injectable()
export class ClientService {
  private handleError: HandleError;

  constructor(
    private readonly http: HttpClient,
    httpErrorHandler: HttpErrorHandler,
  ) {
    this.handleError = httpErrorHandler.createHandleError('ClientService');
  }

  getServerInfo(key?: string) {
    return JSON.parse(localStorage.getItem(APP_INFO))[key];
  }

  getClients(offset: number, limit: number, search: string): Observable<any> {
    const url = `${this.getServerInfo(
      'issuer',
    )}/client/list?limit=${offset}&offset=${limit}&search=${search}`;
    return this.http
      .get<string>(url)
      .pipe(
        catchError(
          this.handleError('getMessage', { message: 'Cannot fetch clients.' }),
        ),
      );
  }

  getClient(clientID: string): Observable<any> {
    const url = `${this.getServerInfo('issuer')}/client/${clientID}`;
    return this.http
      .get<string>(url)
      .pipe(
        catchError(
          this.handleError('getMessage', { message: 'Cannot fetch client.' }),
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
    const url = `${this.getServerInfo('issuer')}/client/create`;
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
    const url = `${this.getServerInfo('issuer')}/client/update`;
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
      authServerURL: this.getServerInfo('issuer'),
      clientId: savedClient.clientId,
      clientSecret: savedClient.clientSecret,
      callbackURLs: savedClient.redirectUris,
    };
    const url = `${clientURL}/setup`;
    return this.http.post(url, payload);
  }

  getScopes() {
    const url = `${this.getServerInfo('issuer')}/scope/list`;
    return this.http.get<string>(url);
  }
}
