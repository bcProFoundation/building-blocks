import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AppService {
  messageUrl = '/message'; // URL to web api
  clientUrl = '/client';

  constructor(private http: HttpClient) {}

  /** GET message from the server */
  getMessage(): Observable<any> {
    return this.http.get<string>(this.messageUrl);
  }

  /** GET clientId from the server */
  getClientId(): Observable<any> {
    return this.http.get<string>(this.clientUrl);
  }
}
