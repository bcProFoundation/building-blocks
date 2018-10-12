import { Document } from 'mongoose';

export interface AuthorizationCode extends Document {
  code?: string;
  redirectUri?: string;
  client?: string;
  user?: string;
  scope?: string[];
}
