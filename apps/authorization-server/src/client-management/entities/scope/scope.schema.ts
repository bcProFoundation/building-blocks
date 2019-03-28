import * as mongoose from 'mongoose';
import * as uuidv4 from 'uuid/v4';

export const schema = new mongoose.Schema(
  {
    name: String,
    description: String,
    uuid: { type: String, default: uuidv4 },
  },
  { collection: 'scope', versionKey: false },
);

export const Scope = schema;

export const SCOPE = 'Scope';

export const ScopeModel = mongoose.model(SCOPE, Scope);
