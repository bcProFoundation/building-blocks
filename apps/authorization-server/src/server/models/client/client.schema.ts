import * as mongoose from 'mongoose';
import * as uuidv4 from 'uuid/v4';
import { randomBytes } from 'crypto';

const schema = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4 },
    creation: Date,
    modified: Date,
    createdBy: String,
    modifiedBy: String,
    name: String,
    clientId: { type: String, default: uuidv4 },
    clientSecret: { type: String, default: randomBytes32 },
    isTrusted: Number,
    redirectUris: [String],
    allowedScopes: [String],
    userDeleteEndpoint: String,
    tokenDeleteEndpoint: String,
    changedClientSecret: String,
  },
  { collection: 'client', versionKey: false },
);

export const Client = schema;

export const CLIENT = 'Client';

export const ClientModel = mongoose.model(CLIENT, Client);

export function randomBytes32() {
  return randomBytes(32).toString('hex');
}
