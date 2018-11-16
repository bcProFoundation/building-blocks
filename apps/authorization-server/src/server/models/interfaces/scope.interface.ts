import { Document } from 'mongoose';

export interface Scope extends Document {
  uuid?: string;
  name?: string;
  description?: string;
}
