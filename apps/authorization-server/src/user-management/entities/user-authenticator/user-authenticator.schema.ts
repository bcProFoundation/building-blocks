import * as mongoose from 'mongoose';
import * as uuidv4 from 'uuid/v4';

const schema = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4 },
    name: String,
    userUuid: String,
    fmt: String,
    publicKey: String,
    counter: Number,
    credID: String,
  },
  { collection: 'user_authenticator', versionKey: false },
);

export const UserAuthenticator = schema;

export const USER_AUTHENTICATOR = 'UserAuthenticator';

export const UserAuthenticatorModel = mongoose.model(
  USER_AUTHENTICATOR,
  UserAuthenticator,
);
