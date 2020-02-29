import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const BearerToken = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4 },
    creation: Date,
    modified: Date,
    createdBy: String,
    modifiedBy: String,
    accessToken: String,
    refreshToken: String,
    redirectUris: [String],
    scope: [String],
    expiresIn: Number,
    user: String,
    client: String,
  },
  { collection: 'bearer_token', versionKey: false },
);

export const BEARER_TOKEN = 'BearerToken';

export const BearerTokenModel = mongoose.model(BEARER_TOKEN, BearerToken);
