import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const AuthData = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4 },
    password: mongoose.Schema.Types.Mixed,
    metaData: mongoose.Schema.Types.Mixed,
    entity: String, // Linked Schema
    entityUuid: String, // Linked instance's uuid
    expiry: Date,
    authDataType: String, // enum AuthDataType
  },
  { collection: 'auth_data', versionKey: false },
);

export const AUTH_DATA = 'AuthData';

export const AuthDataModel = mongoose.model(AUTH_DATA, AuthData);
