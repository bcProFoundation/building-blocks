import { Document } from 'mongoose';

export interface AuthData extends Document {
  uuid?: string;
  password?: string | number;
  entity?: string;
  entityUuid?: string;
  expiry?: Date;
  authDataType?: AuthDataType;
}

export enum AuthDataType {
  LoginOTP = 'LoginOTP',
  Password = 'Password',
  PhoneVerificationCode = 'PhoneVerificationCode',
  SharedSecret = 'SharedSecret',
  TwoFactorTempSecret = 'TwoFactorTempSecret',
  VerificationCode = 'VerificationCode',
}
