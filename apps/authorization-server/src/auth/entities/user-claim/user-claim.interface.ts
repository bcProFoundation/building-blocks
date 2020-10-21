import { Document } from 'mongoose';

export interface UserClaim extends Document {
  uuid: string;
  name: string;
  value: unknown | unknown[];
  scope: string;
}
