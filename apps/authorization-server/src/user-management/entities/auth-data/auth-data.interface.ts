import { Document } from 'mongoose';

export interface AuthData extends Document {
  uuid?: string;
  password?: string;
  metaData?: AuthMetaData;
  entity?: string;
  entityUuid?: string;
  expiry?: Date;
  authDataType?: AuthDataType;
}

export interface AuthMetaData {
  [key: string]: string | number;
}

export enum AuthDataType {
  Challenge = 'Challenge',
  LoginOTP = 'LoginOTP',
  Password = 'Password',
  PhoneVerificationCode = 'PhoneVerificationCode',
  SharedSecret = 'SharedSecret',
  TwoFactorTempSecret = 'TwoFactorTempSecret',
  VerificationCode = 'VerificationCode',
  UnverifiedEmail = 'UnverifiedEmail',
}
