import { Document } from 'mongoose';

export interface AuthData extends Document {
  uuid?: string;
  password?: string;
}
