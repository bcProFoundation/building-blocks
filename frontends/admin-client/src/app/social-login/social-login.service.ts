import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../common/storage.service';
import { ISSUER_URL } from '../constants/storage';

@Injectable({
  providedIn: 'root',
})
export class SocialLoginService {
  constructor(
    private readonly http: HttpClient,
    private storageService: StorageService,
  ) {}

  getSocialLogin(uuid: string) {
    const url = `${this.storageService.getInfo(
      ISSUER_URL,
    )}/social_login/v1/get/${uuid}`;
    return this.http.get(url);
  }

  createSocialLogin(
    name: string,
    description: string,
    clientId: string,
    clientSecret: string,
    authorizationURL: string,
    tokenURL: string,
    introspectionURL: string,
    baseURL: string,
    profileURL: string,
    revocationURL: string,
    scope: string[],
    clientSecretToTokenEndpoint: boolean,
  ) {
    const url = `${this.storageService.getInfo(
      ISSUER_URL,
    )}/social_login/v1/create`;
    return this.http.post(url, {
      name,
      description,
      clientId,
      clientSecret,
      authorizationURL,
      tokenURL,
      introspectionURL,
      baseURL,
      profileURL,
      revocationURL,
      scope,
      clientSecretToTokenEndpoint,
    });
  }

  updateSocialLogin(
    uuid: string,
    name: string,
    description: string,
    clientId: string,
    clientSecret: string,
    authorizationURL: string,
    tokenURL: string,
    introspectionURL: string,
    baseURL: string,
    profileURL: string,
    revocationURL: string,
    scope: string[],
    clientSecretToTokenEndpoint: boolean,
  ) {
    const url = `${this.storageService.getInfo(
      ISSUER_URL,
    )}/social_login/v1/update/${uuid}`;
    return this.http.put(url, {
      name,
      description,
      clientId,
      clientSecret,
      authorizationURL,
      tokenURL,
      introspectionURL,
      baseURL,
      profileURL,
      revocationURL,
      scope,
      clientSecretToTokenEndpoint,
    });
  }

  generateRedirectURL(uuid) {
    return (
      this.storageService.getInfo(ISSUER_URL) + '/social_login/callback/' + uuid
    );
  }
}
