export interface CreateClientResponse {
  clientId?: string;
  clientSecret?: string;
  isTrusted?: boolean;
  name: string;
  redirectUris?: string[];
  uuid?: string;
}
