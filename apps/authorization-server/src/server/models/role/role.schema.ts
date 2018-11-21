import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import * as uuidv4 from 'uuid/v4';

const schema = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4 },
    name: String,
  },
  { collection: 'role', versionKey: false },
);

schema.plugin(mongoosePaginate);

export const Role = schema;

export const ROLE = 'Role';

export const RoleModel = mongoose.model(ROLE, Role);
