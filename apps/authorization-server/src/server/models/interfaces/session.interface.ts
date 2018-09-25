import { Document } from 'mongoose';

export interface Session extends Document {
  sid?: string;
  expiresAt?: number;
  cookie?: string;
  passport?: string;
  authorize?: string;
  user?: string;
}
