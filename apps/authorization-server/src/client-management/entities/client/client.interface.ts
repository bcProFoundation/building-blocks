import { Document } from 'mongoose';

export interface Client extends Document {
  uuid?: string;
  creation?: Date;
  modified?: Date;
  createdBy?: string;
  modifiedBy?: string;
  name?: string;
  clientId?: string;
  clientSecret?: string;
  isTrusted?: number;
  autoApprove?: boolean;
  redirectUris?: string[];
  allowedScopes?: string[];
  userDeleteEndpoint?: string;
  tokenDeleteEndpoint?: string;
  changedClientSecret?: string;
}
