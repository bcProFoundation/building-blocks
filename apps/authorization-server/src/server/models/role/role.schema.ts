import * as mongoose from 'mongoose';

export const Role = new mongoose.Schema(
  { name: String },
  { collection: 'role', versionKey: false },
);

export const ROLE = 'Role';

export const RoleModel = mongoose.model(ROLE, Role);
