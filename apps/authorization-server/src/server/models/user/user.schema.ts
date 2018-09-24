import * as mongoose from 'mongoose';
import * as uuidv4 from 'uuid/v4';

export const User = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4 },
    creation: Date,
    modified: Date,
    createdBy: String,
    modifiedBy: String,
    disabled: { type: Boolean, default: false },
    name: String,
    phone: String,
    email: String,
    password: String, // uuid of auth-data
    roles: [String],
    enable2fa: { type: Boolean, default: false },
    sharedSecret: String, // uuid of auth-data
    otpPeriod: { type: Number, default: 30 },
    otpCounter: String, // uuid of auth-data
    twoFactorTempSecret: String, // uuid of auth data
  },
  { collection: 'user', versionKey: false },
);

export const USER = 'User';

export const UserModel = mongoose.model(USER, User);
