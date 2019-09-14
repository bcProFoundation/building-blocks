import { Document } from 'mongoose';

export interface UserAuthenticator extends Document {
  uuid?: string;
  name?: string;
  userUuid: string;
  fmt: Fmt;
  publicKey: string;
  counter: number;
  credID: string;
}

export enum Fmt {
  packed = 'packed',
}
