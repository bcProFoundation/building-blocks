import { ParsedUrlQueryInput } from 'querystring';

export interface OAuth2TokenRequest extends ParsedUrlQueryInput {
  code?: string;
  grant_type?: string;
  redirect_uri?: string;
  client_id?: string;
  scope?: string;
  client_secret?: string;
}
