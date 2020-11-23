import { Document } from 'mongoose';

export interface UserClaim extends Document {
  claimId: string;
  uuid: string;
  name: string;
  value: unknown | unknown[];
  scope: string;
}
