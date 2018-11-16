import { Document } from 'mongoose';

export interface Role extends Document {
  uuid?: string;
  name?: string;
}
