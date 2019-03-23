import { Document } from 'mongoose';

export interface User extends Document {
  uuid?: string;
  creation?: Date;
  modified?: Date;
  createdBy?: string;
  modifiedBy?: string;
  disabled?: boolean;
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  roles?: string[];
  enable2fa?: boolean;
  sharedSecret?: string;
  otpPeriod?: number;
  otpCounter?: string;
  twoFactorTempSecret?: string;
  verificationCode?: string;
  deleted?: boolean;
  enablePasswordLess?: boolean;
}
