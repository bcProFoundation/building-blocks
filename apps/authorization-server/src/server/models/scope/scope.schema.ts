import * as mongoose from 'mongoose';

export const Scope = new mongoose.Schema(
  {
    name: String,
    description: String,
  },
  { collection: 'scope', versionKey: false },
);

export const SCOPE = 'Scope';

export const ScopeModel = mongoose.model(SCOPE, Scope);
