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
  LoginOTP,
  Password,
  PhoneVerificationCode,
  SharedSecret,
  VerificationCode,
  TwoFactorTempSecret,
}
