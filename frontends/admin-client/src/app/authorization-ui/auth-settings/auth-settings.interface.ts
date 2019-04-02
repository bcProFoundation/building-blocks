export interface IAuthSettings {
  appURL?: string;
  authServerURL?: string;
  authorizationURL?: string;
  callbackURLs?: string[];
  clientId: string;
  clientSecret: string;
  communicationServerSystemEmailAccount?: string;
  introspectionURL?: string;
  profileURL?: string;
  revocationURL?: string;
  service?: string;
  tokenURL?: string;
  uuid?: string;
  serviceName?: string;
  cloudStorageSettings?: string;
}
