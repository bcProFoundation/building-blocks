import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { solveRegistrationChallenge } from '@webauthn/client';

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
        map(challenge => {
          const { excludeCredentials } = challenge;
          return {
            ...challenge,
            excludeCredentials: excludeCredentials.map(cred => ({
              ...cred,
              id: this.base64ToArrayBuffer(cred.id),
            })),
          };
        }),
        switchMap(challenge => {
          return from(solveRegistrationChallenge(challenge));
        }),
        switchMap(credentials => {
          const challengeReqHeaders = new HttpHeaders().set(
            'Content-Type',
            'application/json',
          );
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

  base64ToArrayBuffer(base64string: string) {
    const binaryString = atob(base64string);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
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
