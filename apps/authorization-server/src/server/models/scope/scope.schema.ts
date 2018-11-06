import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

export const schema = new mongoose.Schema(
  {
    name: String,
    description: String,
  },
  { collection: 'scope', versionKey: false },
);

schema.plugin(mongoosePaginate);

export const Scope = schema;

export const SCOPE = 'Scope';

export const ScopeModel = mongoose.model(SCOPE, Scope);
