import { Document } from 'mongoose';

export interface OIDCKey extends Document {
  uuid?: string;
  keyPair?: any;
  creation?: Date;
}
