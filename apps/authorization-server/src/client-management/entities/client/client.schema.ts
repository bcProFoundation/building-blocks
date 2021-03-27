import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';
import { ClientAuthentication } from './client.interface';

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
    autoApprove: Boolean,
    redirectUris: [String],
    allowedScopes: [String],
    userDeleteEndpoint: String,
    tokenDeleteEndpoint: String,
    changedClientSecret: String,
    authenticationMethod: {
      type: String,
      default: ClientAuthentication.PublicClient,
    },
  },
  { collection: 'client', versionKey: false },
);

export const Client = schema;

export const CLIENT = 'Client';

export const ClientModel = mongoose.model(CLIENT, Client);

export function randomBytes32() {
  return randomBytes(32).toString('hex');
}
