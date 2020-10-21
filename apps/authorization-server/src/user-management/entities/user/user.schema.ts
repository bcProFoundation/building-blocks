import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const schema = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4 },
    creation: { type: Date, default: nowDate },
    modified: Date,
    createdBy: String,
    modifiedBy: String,
    disabled: { type: Boolean, default: false },
    name: String,
    phone: { type: String, unique: true },
    unverifiedPhone: String,
    email: { type: String, unique: true },
    password: String, // uuid of auth-data
    roles: [String],
    enable2fa: { type: Boolean, default: false },
    sharedSecret: String, // uuid of auth-data
    otpPeriod: { type: Number, default: 30 },
    otpCounter: String, // uuid of auth-data
    twoFactorTempSecret: String, // uuid of auth data
    verificationCode: String, // code to complete signup via email
    deleted: { type: Boolean, default: false },
    enablePasswordLess: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
  },
  { collection: 'user', versionKey: false },
);

export const User = schema;

export const USER = 'User';

export const UserModel = mongoose.model(USER, User);

function nowDate() {
  return new Date();
}
