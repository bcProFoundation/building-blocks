import { Document } from 'mongoose';

export interface Scope extends Document {
  name?: string;
  description?: string;
}
