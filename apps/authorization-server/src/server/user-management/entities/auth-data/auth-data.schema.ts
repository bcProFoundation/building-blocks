import * as mongoose from 'mongoose';
import * as uuidv4 from 'uuid/v4';

export const AuthData = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4 },
    password: mongoose.Schema.Types.Mixed,
  },
  { collection: 'auth_data', versionKey: false },
);

export const AUTH_DATA = 'AuthData';

export const AuthDataModel = mongoose.model(AUTH_DATA, AuthData);
