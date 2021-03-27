import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const schema = new mongoose.Schema(
  {
    name: String,
    description: String,
    uuid: { type: String, default: uuidv4 },
    clientId: String,
    clientSecret: String,
    authorizationURL: String,
    tokenURL: String,
    introspectionURL: String,
    baseURL: String,
    profileURL: String,
    revocationURL: String,
    createdBy: String,
    modifiedBy: String,
    creation: { type: Date, default: nowDate },
    modified: Date,
    scope: [String],
    clientSecretToTokenEndpoint: { type: Boolean, default: false },
  },
  { collection: 'social_login', versionKey: false },
);

export const SocialLogin = schema;

export const SOCIAL_LOGIN = 'SocialLogin';

export const SocialLoginModel = mongoose.model(SOCIAL_LOGIN, SocialLogin);

function nowDate() {
  return new Date();
}
