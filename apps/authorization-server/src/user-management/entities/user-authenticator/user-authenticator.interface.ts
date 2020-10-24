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
  PACKED = 'packed',
  FIDO_U2F = 'fido-u2f',
  ANDROID_SAFETYNET = 'android-safetynet',
  ANDROID_KEY = 'android-key',
  TPM = 'tpm',
  APPLE = 'apple',
  NONE = 'none',
}
