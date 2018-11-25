import * as mongoose from 'mongoose';
import * as uuidv4 from 'uuid/v4';

const schema = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4 },
    name: String,
  },
  { collection: 'role', versionKey: false },
);

export const Role = schema;

export const ROLE = 'Role';

export const RoleModel = mongoose.model(ROLE, Role);
