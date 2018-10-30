import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

const schema = new mongoose.Schema(
  { name: String },
  { collection: 'role', versionKey: false },
);

schema.plugin(mongoosePaginate);

export const Role = schema;

export const ROLE = 'Role';

export const RoleModel = mongoose.model(ROLE, Role);
