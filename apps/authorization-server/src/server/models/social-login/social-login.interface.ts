import { Document } from 'mongoose';

export interface SocialLogin extends Document {
  name?: string;
  description?: string;
  uuid?: string;
  clientId?: string;
  clientSecret?: string;
  authorizationURL?: string;
  tokenURL?: string;
  introspectionURL?: string;
  baseURL?: string;
  profileURL?: string;
  revocationURL?: string;
  createdBy?: string;
  modifiedBy?: string;
  creation?: Date;
  modified?: Date;
  scope?: string[];
  clientSecretToTokenEndpoint?: boolean;
}
