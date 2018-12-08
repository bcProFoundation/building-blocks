'use strict';
import { RoleService } from '../dist/out-tsc/models/role/role.service';
import { ScopeService } from '../dist/out-tsc/models/scope/scope.service';
const uuidv4 = require('uuid/v4');
const core = require('@nestjs/core');
const appModule = require('../dist/out-tsc/app.module');

export async function up() {
  const app = await core.NestFactory.create(appModule.AppModule);

  // Patch Roles
  const roleService = await app.get(RoleService);
  const roleModel = roleService.getModel();
  const roles = await roleModel
    .find()
    .select('-uuid')
    .exec();
  for (let i = 0; i < roles.length; i++) {
    const role = roles[i];
    role.uuid = uuidv4();
    await roleModel.updateOne({ name: role.name }, role);
  }

  // Patch Scopes
  const scopeService = await app.get(ScopeService);
  const scopeModel = scopeService.getModel();
  const scopes = await scopeModel
    .find()
    .select('-uuid')
    .exec();
  for (let i = 0; i < scopes.length; i++) {
    const scope = scopes[i];
    scope.uuid = uuidv4();
    await scopeModel.updateOne({ name: scope.name }, scope);
  }
}

export async function down() {
  const app = await core.NestFactory.create(appModule.AppModule);

  // Rollback Roles
  const roleService = await app.get(RoleService);
  const roleModel = roleService.getModel();
  const roles = await roleModel
    .find()
    .select('-uuid')
    .exec();
  for (let i = 0; i < roles.length; i++) {
    const role = roles[i];
    await roleModel.updateOne({ name: role.name }, { $unset: { uuid: 1 } });
  }

  // Rollback Scopes
  const scopeService = await app.get(ScopeService);
  const scopeModel = scopeService.getModel();
  const scopes = await scopeModel
    .find()
    .select('-uuid')
    .exec();
  for (let i = 0; i < scopes.length; i++) {
    const scope = scopes[i];
    await scopeModel.updateOne({ name: scope.name }, { $unset: { uuid: 1 } });
  }
}
