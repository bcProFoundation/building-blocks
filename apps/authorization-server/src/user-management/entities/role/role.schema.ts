import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

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
