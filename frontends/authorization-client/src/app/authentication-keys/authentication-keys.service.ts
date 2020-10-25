import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { create } from '@github/webauthn-json';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationKeysService {
  constructor(private readonly http: HttpClient) {}

  addAuthKey(userUuid: string, accessToken: string) {
    const registerReqHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + accessToken);
    return this.http
      .post<any>(
        '/webauthn/v1/request_register',
        { userUuid },
        { headers: registerReqHeaders },
      )
      .pipe(
        switchMap(challenge => {
          return from(create({ publicKey: challenge }));
        }),
        switchMap(credentials => {
          const challengeReqHeaders = new HttpHeaders()
            .append('Content-Type', 'application/json')
            .append('Authorization', 'Bearer ' + accessToken);

          return this.http.post<{ registered: string }>(
            '/webauthn/v1/register',
            credentials,
            {
              headers: challengeReqHeaders,
            },
          );
        }),
      );
  }

  renameAuthKey(uuid: string, name: string, accessToken: string) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + accessToken);

    return this.http.post<any>(
      '/webauthn/v1/rename_authenticator/' + uuid,
      { name },
      { headers },
    );
  }

  removeAuthKey(uuid: string, accessToken: string) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + accessToken);

    return this.http.post<any>(
      '/webauthn/v1/remove_authenticator/' + uuid,
      {},
      { headers },
    );
  }

  getAuthenticators(userUuid: string, accessToken: string) {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + accessToken,
    );
    return this.http.get('/webauthn/v1/authenticators/' + userUuid, {
      headers,
    });
  }
}
