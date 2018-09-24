import * as mongoose from 'mongoose';
import * as uuidv4 from 'uuid/v4';

export const Client = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4 },
    creation: Date,
    modified: Date,
    createdBy: String,
    modifiedBy: String,
    name: String,
    clientId: { type: String, default: uuidv4 },
    clientSecret: String,
    isTrusted: Number,
    redirectUris: [String],
    allowedScopes: [String],
  },
  { collection: 'client', versionKey: false },
);

export const CLIENT = 'Client';

export const ClientModel = mongoose.model(CLIENT, Client);
