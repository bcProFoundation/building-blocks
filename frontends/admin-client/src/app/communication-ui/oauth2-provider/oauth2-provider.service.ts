import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { StorageService } from '../../common/services/storage/storage.service';
import { COMMUNICATION_SERVER } from 'src/app/constants/storage';

@Injectable({
  providedIn: 'root',
})
export class OAuth2ProviderService {
  authorizationHeader: HttpHeaders;

  constructor(
    private readonly http: HttpClient,
    private readonly storageService: StorageService,
    private readonly oauthService: OAuthService,
  ) {
    this.authorizationHeader = new HttpHeaders({
      Authorization: 'Bearer ' + this.oauthService.getAccessToken(),
    });
  }

  createProvider(
    name: string,
    authServerURL: string,
    clientId: string,
    clientSecret: string,
    profileURL: string,
    tokenURL: string,
    introspectionURL: string,
    authorizationURL: string,
    revocationURL: string,
    scope: string[],
  ) {
    const url = `${this.storageService.getServiceURL(
      COMMUNICATION_SERVER,
    )}/oauth2_provider/v1/add_provider`;
    const payload = {
      name,
      authServerURL,
      clientId,
      clientSecret,
      profileURL,
      tokenURL,
      introspectionURL,
      authorizationURL,
      revocationURL,
      scope,
    };

    return this.http.post(url, payload, {
      headers: this.authorizationHeader,
    });
  }

  updateProvider(
    uuid: string,
    name: string,
    authServerURL: string,
    clientId: string,
    clientSecret: string,
    profileURL: string,
    tokenURL: string,
    introspectionURL: string,
    authorizationURL: string,
    revocationURL: string,
    scope: string[],
  ) {
    const url = `${this.storageService.getServiceURL(
      COMMUNICATION_SERVER,
    )}/oauth2_provider/v1/update_provider/${uuid}`;
    const payload = {
      name,
      authServerURL,
      clientId,
      clientSecret,
      profileURL,
      tokenURL,
      introspectionURL,
      authorizationURL,
      revocationURL,
      scope,
    };

    return this.http.post(url, payload, {
      headers: this.authorizationHeader,
    });
  }

  getProvider(uuid) {
    const url = `${this.storageService.getServiceURL(
      COMMUNICATION_SERVER,
    )}/oauth2_provider/v1/retrieve_provider/${uuid}`;
    return this.http.get<any>(url, { headers: this.authorizationHeader });
  }

  generateRedirectURL(uuid: string) {
    return (
      this.storageService.getServiceURL(COMMUNICATION_SERVER) +
      '/oauth2_provider/callback/' +
      uuid
    );
  }
}
