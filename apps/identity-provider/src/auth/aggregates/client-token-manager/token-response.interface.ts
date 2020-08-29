export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  scope: string;
  expires_in: string | number;
}
