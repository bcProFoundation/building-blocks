import { Document } from 'mongoose';

export interface Session extends Document {
  [key: string]: any;
}
