import * as mongoose from 'mongoose';

export const schema = new mongoose.Schema(
  {
    code: String,
    redirectUri: String,
    client: String,
    user: String,
    scope: [String],
  },
  { collection: 'authorization_code', versionKey: false },
);

export const AuthorizationCode = schema;

export const AUTHORIZATION_CODE = 'AuthorizationCode';

export const AuthorizationCodeModel = mongoose.model(
  AUTHORIZATION_CODE,
  AuthorizationCode,
);
