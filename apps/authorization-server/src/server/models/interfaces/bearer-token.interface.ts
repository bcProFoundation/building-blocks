import { Document } from 'mongoose';

export interface BearerToken extends Document {
  uuid?: string;
  creation?: Date;
  modified?: Date;
  createdBy?: string;
  modifiedBy?: string;
  accessToken?: string;
  refreshToken?: string;
  redirectUris?: string[];
  scope?: string[];
  expiresIn?: number;
  user?: string;
  client?: string;
}
